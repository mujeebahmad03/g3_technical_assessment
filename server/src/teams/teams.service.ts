import { Injectable } from "@nestjs/common";
import slugify from "slugify";
import { ResponseHelperService } from "src/helper/response-helper.service";
import { ResponseModel } from "src/models/global.model";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateTeamDto,
  InviteUserDto,
  TeamResponseModel,
  InvitationResponseModel,
  TeamMemberResponseModel,
} from "./dto";
import { InvitationStatus, Role } from "prisma/generated/prisma/enums";
import { PaginationHelperService } from "src/helper/pagination-helper.service";
import { QueryOptionsDto } from "src/common/dto";
import { HelperService } from "src/helper/helper.service";
import { Prisma } from "prisma/generated/prisma/client";
import { QueryOptions } from "src/common/interfaces";

@Injectable()
export class TeamsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamResponseHelper: ResponseHelperService<TeamResponseModel>,
    private readonly inviteResponseHelper: ResponseHelperService<InvitationResponseModel>,
    private readonly teamsResponseHelper: PaginationHelperService<
      TeamResponseModel[]
    >,
    private readonly teamMembersResponseHelper: PaginationHelperService<
      TeamMemberResponseModel[]
    >,
    private readonly invitesResponseHelper: PaginationHelperService<
      InvitationResponseModel[]
    >,
    private readonly helperService: HelperService,
  ) {}

  /**
   * Create a new team
   */
  async createTeam(
    userId: string,
    data: CreateTeamDto,
  ): Promise<ResponseModel<TeamResponseModel>> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      this.teamResponseHelper.throwNotFound("User not found");
    }

    // Check if team name already exists for this user
    const existingTeam = await this.prisma.team.findFirst({
      where: {
        ownerId: userId,
        name: data.name,
      },
    });

    if (existingTeam) {
      this.teamResponseHelper.throwBadRequest(
        "Team with this name already exists",
      );
    }

    // Generate unique slug
    const uniqueSlug = await this.generateUniqueSlug(data.name);

    // Create team and add creator as admin
    const team = await this.prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        slug: uniqueSlug,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: Role.ADMIN,
            joinedAt: new Date(),
          },
        },
      },
    });

    return this.teamResponseHelper.returnSuccessObject(
      "Team created successfully",
      team,
    );
  }

  /**
   * Get team details by ID
   */
  async getTeamMembers(
    teamId: string,
    userId: string,
    query?: QueryOptionsDto,
  ): Promise<ResponseModel<TeamMemberResponseModel[]>> {
    const { limit = 10, page = 1, searchKey = "" } = query || {};
    const skip = (page - 1) * limit;

    // Ensure requesting user is a member
    const teamMember = await this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });

    if (!teamMember) {
      this.teamResponseHelper.throwForbidden(
        "You don't have access to this team",
      );
    }

    // Build query
    const whereClause: Prisma.TeamMemberWhereInput = {
      teamId,
      ...(searchKey
        ? {
            user: {
              OR: [
                { email: { contains: searchKey, mode: "insensitive" } },
                { username: { contains: searchKey, mode: "insensitive" } },
                { firstName: { contains: searchKey, mode: "insensitive" } },
                { lastName: { contains: searchKey, mode: "insensitive" } },
              ],
            },
          }
        : {}),
    };

    const [members, count] = await Promise.all([
      this.prisma.teamMember.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { joinedAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
      }),
      this.prisma.teamMember.count({ where: whereClause }),
    ]);

    const pagination = this.helperService.paginate(count, page, limit);

    return this.teamMembersResponseHelper.returnSuccessObjectWithPagination(
      "Team members retrieved successfully",
      members,
      pagination,
    );
  }

  /**
   * Get all teams for a user
   */
  async getUserTeams(
    userId: string,
    query?: QueryOptionsDto,
  ): Promise<ResponseModel<TeamResponseModel[]>> {
    const { limit = 10, page = 1, searchKey = "" } = query || {};

    const skip = (page - 1) * limit;

    const whereClause: Prisma.TeamWhereInput = {
      members: {
        some: {
          userId,
        },
      },
      isArchived: false,
      ...(searchKey
        ? {
            OR: [
              { name: { contains: searchKey, mode: "insensitive" } },
              { slug: { contains: searchKey, mode: "insensitive" } },
              { description: { contains: searchKey, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [teams, count] = await Promise.all([
      this.prisma.team.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.team.count({ where: whereClause }),
    ]);

    const pagination = this.helperService.paginate(count, page, limit);

    return this.teamsResponseHelper.returnSuccessObjectWithPagination(
      "User teams retrieved successfully",
      teams,
      pagination,
    );
  }

  /**
   * Invite a user to a team
   */
  async inviteUserToTeam(
    teamId: string,
    inviterId: string,
    data: InviteUserDto,
  ): Promise<ResponseModel<InvitationResponseModel>> {
    // Validate that either email or username is provided
    if (!data.email && !data.username) {
      this.teamResponseHelper.throwBadRequest(
        "Either email or username must be provided",
      );
    }

    // Check if team exists
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: { id: true, name: true },
    });

    if (!team) {
      this.teamResponseHelper.throwNotFound("Team not found");
    }

    // Find user by email or username
    let userToInvite: {
      id: string;
      email: string;
      username: string;
    } | null = null;

    if (data.email) {
      userToInvite = await this.prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true, email: true, username: true },
      });
    } else if (data.username) {
      userToInvite = await this.prisma.user.findUnique({
        where: { username: data.username },
        select: { id: true, email: true, username: true },
      });
    }

    if (!userToInvite) {
      const identifier = data.email
        ? `email ${data.email}`
        : `username ${data.username}`;
      this.teamResponseHelper.throwNotFound(
        `User with ${identifier} not found`,
      );
    }

    // Check if user is already a member
    const existingMember = await this.prisma.teamMember.findFirst({
      where: {
        teamId: teamId,
        userId: userToInvite.id,
      },
    });

    if (existingMember) {
      this.teamResponseHelper.throwBadRequest(
        "User is already a member of this team",
      );
    }

    // Check if there's already a pending invitation
    const existingInvitation = await this.prisma.invitation.findFirst({
      where: {
        teamId: teamId,
        email: userToInvite.email,
        status: "PENDING",
      },
    });

    if (existingInvitation) {
      this.teamResponseHelper.throwBadRequest(
        "User already has a pending invitation",
      );
    }

    // Create invitation
    const invitation = await this.prisma.invitation.create({
      data: {
        email: userToInvite.email,
        teamId: teamId,
        invitedBy: inviterId,
      },
    });

    return this.inviteResponseHelper.returnSuccessObject(
      "User invited to team successfully",
      invitation,
    );
  }

  /**
   * Accept team invitation
   */
  async acceptInvitation(
    invitationId: string,
    userId: string,
  ): Promise<ResponseModel<InvitationResponseModel>> {
    // Find the invitation
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        team: {
          select: { id: true, name: true },
        },
      },
    });

    if (!invitation) {
      this.teamResponseHelper.throwNotFound("Invitation not found");
    }

    if (invitation.status !== "PENDING") {
      this.teamResponseHelper.throwBadRequest("Invitation is no longer valid");
    }

    // Verify the user's email matches the invitation
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user || user.email !== invitation.email) {
      this.teamResponseHelper.throwForbidden(
        "You are not authorized to accept this invitation",
      );
    }

    // Check if user is already a member
    const existingMember = await this.prisma.teamMember.findFirst({
      where: {
        teamId: invitation.teamId,
        userId: userId,
      },
    });

    if (existingMember) {
      this.teamResponseHelper.throwBadRequest(
        "You are already a member of this team",
      );
    }

    // Use transaction to update invitation and create team member
    await this.prisma.$transaction(async (tx) => {
      // Update invitation status
      await tx.invitation.update({
        where: { id: invitationId },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      });

      // Create team member
      await tx.teamMember.create({
        data: {
          userId: userId,
          teamId: invitation.teamId,
          role: "MEMBER",
          joinedAt: new Date(),
          invitedAt: invitation.invitedAt,
          invitedBy: invitation.invitedBy,
        },
      });
    });

    return this.inviteResponseHelper.returnSuccessObject(
      "Invitation accepted successfully",
    );
  }

  /**
   * Get pending invitations for a user
   */
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
      this.inviteResponseHelper.throwNotFound("User not found");
    }

    // start with base condition
    let whereClause: Prisma.InvitationWhereInput = {
      email: user.email,
      ...(searchKey && {
        OR: [
          { email: { contains: searchKey, mode: "insensitive" } },
          { team: { name: { contains: searchKey, mode: "insensitive" } } },
        ],
      }),
    };

    // apply filters (example: status eq)
    if (filters.status?.eq) {
      whereClause = {
        ...whereClause,
        status: filters.status.eq as InvitationStatus,
      };
    }

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

    return this.invitesResponseHelper.returnSuccessObjectWithPagination(
      "Invitations retrieved successfully",
      invitations,
      pagination,
    );
  }

  /**
   * Generate a unique slug for a team name
   */
  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    let uniqueSlug = baseSlug;
    let counter = 1;

    while (
      await this.prisma.team.findUnique({
        where: { slug: uniqueSlug },
        select: { id: true },
      })
    ) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }
}
