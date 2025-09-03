import { Injectable } from "@nestjs/common";
import { InviteUserDto, InvitationResponseModel, BulkInviteDto } from "../dto";
import { InvitationStatus } from "prisma/generated/prisma/enums";
import { QueryOptions } from "src/common/interfaces";
import { PrismaService } from "src/prisma/prisma.service";
import { ResponseHelperService } from "src/helper/response-helper.service";
import { PaginationHelperService } from "src/helper/pagination-helper.service";
import { TeamMemberService } from "./team-member.service";
import { HelperService } from "src/helper/helper.service";
import { ResponseModel } from "src/models/global.model";
import { Invitation, Prisma } from "prisma/generated/prisma/client";

@Injectable()
export class TeamInvitationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseHelper: ResponseHelperService<InvitationResponseModel>,
    private readonly paginationHelper: PaginationHelperService<
      InvitationResponseModel[]
    >,
    private readonly teamMemberService: TeamMemberService,
    private readonly helperService: HelperService,
  ) {}

  async inviteUserToTeam(
    teamId: string,
    inviterId: string,
    data: InviteUserDto,
  ): Promise<ResponseModel<InvitationResponseModel>> {
    // Validate input
    if (!data.email && !data.username) {
      this.responseHelper.throwBadRequest(
        "Either email or username must be provided",
      );
    }

    // Find user to invite
    const userToInvite = await this.findUserByEmailOrUsername(data);
    if (!userToInvite) {
      const identifier = data.email
        ? `email ${data.email}`
        : `username ${data.username}`;
      this.responseHelper.throwNotFound(`User with ${identifier} not found`);
    }

    // Validate invitation constraints
    await this.validateInvitation(teamId, userToInvite);

    // Create invitation
    const invitation = await this.prisma.invitation.create({
      data: {
        email: userToInvite.email,
        teamId,
        invitedBy: inviterId,
      },
    });

    return this.responseHelper.returnSuccessObject(
      "User invited to team successfully",
      invitation,
    );
  }

  async acceptInvitation(
    invitationId: string,
    userId: string,
  ): Promise<ResponseModel<InvitationResponseModel>> {
    const invitation = await this.getValidInvitation(invitationId);
    await this.validateUserCanAcceptInvitation(invitation, userId);

    // Use transaction to update invitation and create team member
    await this.prisma.$transaction(async (tx) => {
      await tx.invitation.update({
        where: { id: invitationId },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      });

      await this.teamMemberService.addMemberToTeam(
        invitation.teamId,
        userId,
        invitation.invitedBy,
        invitation.invitedAt,
      );
    });

    return this.responseHelper.returnSuccessObject(
      "Invitation accepted successfully",
    );
  }

  async bulkInviteUsersToTeam(
    teamId: string,
    inviterId: string,
    dto: BulkInviteDto,
  ): Promise<ResponseModel<InvitationResponseModel>> {
    const { invitees } = dto;

    // Ensure team exists
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: { id: true },
    });

    if (!team) {
      this.responseHelper.throwNotFound("Team not found");
    }

    const results: InvitationResponseModel[] = [];

    await this.prisma.$transaction(async (tx) => {
      for (const data of invitees) {
        const result = await this.processBulkInvite(
          tx,
          teamId,
          inviterId,
          data,
        );
        if (result) results.push(result);
      }
    });

    return this.responseHelper.returnSuccessObject(
      `${results.length} invitations sent successfully`,
    );
  }

  async getInvitations(
    userId: string,
    query?: QueryOptions,
  ): Promise<ResponseModel<InvitationResponseModel[]>> {
    const { limit = 10, page = 1, searchKey = "", filters = {} } = query || {};
    const skip = (page - 1) * limit;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      this.responseHelper.throwNotFound("User not found");
    }

    const whereClause = this.buildInvitationQuery(
      user.email,
      searchKey,
      filters,
    );

    const [invitations, count] = await Promise.all([
      this.prisma.invitation.findMany({
        where: whereClause,
        orderBy: { invitedAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.invitation.count({ where: whereClause }),
    ]);

    const pagination = this.helperService.paginate(count, page, limit);

    return this.paginationHelper.returnSuccessObjectWithPagination(
      "Invitations retrieved successfully",
      invitations,
      pagination,
    );
  }

  private async findUserByEmailOrUsername(data: InviteUserDto) {
    if (data.email) {
      return this.prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true, email: true, username: true },
      });
    }

    return this.prisma.user.findUnique({
      where: { username: data.username! },
      select: { id: true, email: true, username: true },
    });
  }

  private async validateInvitation(
    teamId: string,
    user: { id: string; email: string },
  ) {
    // Check if team exists
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: { id: true, name: true },
    });

    if (!team) {
      this.responseHelper.throwNotFound("Team not found");
    }

    // Check if user is already a member
    if (await this.teamMemberService.isTeamMember(teamId, user.id)) {
      this.responseHelper.throwBadRequest(
        "User is already a member of this team",
      );
    }

    // Check if there's already a pending invitation
    const existingInvitation = await this.prisma.invitation.findFirst({
      where: {
        teamId,
        email: user.email,
        status: "PENDING",
      },
    });

    if (existingInvitation) {
      this.responseHelper.throwBadRequest(
        "User already has a pending invitation",
      );
    }
  }

  private async getValidInvitation(invitationId: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        team: { select: { id: true, name: true } },
      },
    });

    if (!invitation) {
      this.responseHelper.throwNotFound("Invitation not found");
    }

    if (invitation.status !== "PENDING") {
      this.responseHelper.throwBadRequest("Invitation is no longer valid");
    }

    return invitation;
  }

  private async validateUserCanAcceptInvitation(
    invitation: Invitation,
    userId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user || user.email !== invitation.email) {
      this.responseHelper.throwForbidden(
        "You are not authorized to accept this invitation",
      );
    }

    // Check if user is already a member
    if (await this.teamMemberService.isTeamMember(invitation.teamId, userId)) {
      this.responseHelper.throwBadRequest(
        "You are already a member of this team",
      );
    }

    return user;
  }

  private async processBulkInvite(
    tx: Prisma.TransactionClient,
    teamId: string,
    inviterId: string,
    data: InviteUserDto,
  ) {
    if (!data.email && !data.username) return null;

    // Find user
    const userToInvite = data.email
      ? await tx.user.findUnique({
          where: { email: data.email },
          select: { id: true, email: true },
        })
      : await tx.user.findUnique({
          where: { username: data.username! },
          select: { id: true, email: true },
        });

    if (!userToInvite) return null;

    // Skip if already member
    const existingMember = await tx.teamMember.findFirst({
      where: { teamId, userId: userToInvite.id },
    });
    if (existingMember) return null;

    // Skip if already has pending invite
    const existingInvitation = await tx.invitation.findFirst({
      where: { teamId, email: userToInvite.email, status: "PENDING" },
    });
    if (existingInvitation) return null;

    // Create invite
    return tx.invitation.create({
      data: {
        email: userToInvite.email,
        teamId,
        invitedBy: inviterId,
      },
    });
  }

  private buildInvitationQuery(
    email: string,
    searchKey: string,
    filters: QueryOptions["filters"],
  ): Prisma.InvitationWhereInput {
    const whereClause: Prisma.InvitationWhereInput = {
      email,
      ...(searchKey && {
        OR: [
          { email: { contains: searchKey, mode: "insensitive" } },
          { team: { name: { contains: searchKey, mode: "insensitive" } } },
        ],
      }),
    };

    if (filters?.status?.eq) {
      whereClause.status = filters.status.eq as InvitationStatus;
    }

    return whereClause;
  }
}
