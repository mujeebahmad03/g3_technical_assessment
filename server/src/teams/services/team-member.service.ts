import { Injectable } from "@nestjs/common";
import { PaginationHelperService } from "src/helper/pagination-helper.service";
import { QueryOptionsDto } from "src/common/dto";
import {
  TeamMemberResponseModel,
  BulkRemoveUserDto,
  TeamResponseModel,
} from "../dto";
import { Role } from "prisma/generated/prisma/enums";
import { Prisma } from "prisma/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ResponseHelperService } from "src/helper/response-helper.service";
import { HelperService } from "src/helper/helper.service";
import { ResponseModel } from "src/models/global.model";

@Injectable()
export class TeamMemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseHelper: PaginationHelperService<
      TeamMemberResponseModel[]
    >,
    private readonly teamResponseHelper: ResponseHelperService<TeamResponseModel>,
    private readonly helperService: HelperService,
  ) {}

  async getTeamMembers(
    teamId: string,
    userId: string,
    query?: QueryOptionsDto,
  ): Promise<ResponseModel<TeamMemberResponseModel[]>> {
    const { limit = 10, page = 1, searchKey = "" } = query || {};
    const skip = (page - 1) * limit;

    // Ensure requesting user is a member
    if (!(await this.isTeamMember(teamId, userId))) {
      this.teamResponseHelper.throwForbidden(
        "You don't have access to this team",
      );
    }

    const whereClause = this.buildMemberSearchQuery(teamId, searchKey);

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

    return this.responseHelper.returnSuccessObjectWithPagination(
      "Team members retrieved successfully",
      members,
      pagination,
    );
  }

  async isTeamMember(teamId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.teamMember.findFirst({
      where: { teamId, userId },
      select: { id: true },
    });
    return !!member;
  }

  async isTeamAdmin(teamId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.teamMember.findFirst({
      where: { teamId, userId },
      select: { role: true },
    });
    return member?.role === Role.ADMIN;
  }

  async addMemberToTeam(
    teamId: string,
    userId: string,
    invitedBy?: string,
    invitedAt?: Date,
  ): Promise<void> {
    await this.prisma.teamMember.create({
      data: {
        userId,
        teamId,
        role: Role.MEMBER,
        joinedAt: new Date(),
        invitedBy,
        invitedAt,
      },
    });
  }

  async removeUserFromTeam(
    teamId: string,
    requesterId: string,
    targetUserId: string,
  ): Promise<ResponseModel<TeamResponseModel>> {
    // Validate permissions and constraints
    await this.validateRemovalPermissions(teamId, requesterId, targetUserId);

    // Remove target member
    await this.prisma.teamMember.delete({
      where: {
        userId_teamId: {
          userId: targetUserId,
          teamId,
        },
      },
    });

    return this.teamResponseHelper.returnSuccessObject(
      "User removed from team successfully",
    );
  }

  async bulkRemoveUsersFromTeam(
    teamId: string,
    requesterId: string,
    dto: BulkRemoveUserDto,
  ): Promise<ResponseModel<TeamResponseModel>> {
    const { targetIds } = dto;

    // Validate permissions
    await this.validateBulkRemovalPermissions(teamId, requesterId, targetIds);

    await this.prisma.teamMember.deleteMany({
      where: {
        teamId,
        userId: { in: targetIds },
      },
    });

    return this.teamResponseHelper.returnSuccessObject(
      "Users removed from team successfully",
    );
  }

  private buildMemberSearchQuery(
    teamId: string,
    searchKey: string,
  ): Prisma.TeamMemberWhereInput {
    return {
      teamId,
      ...(searchKey && {
        user: {
          OR: [
            { email: { contains: searchKey, mode: "insensitive" } },
            { username: { contains: searchKey, mode: "insensitive" } },
            { firstName: { contains: searchKey, mode: "insensitive" } },
            { lastName: { contains: searchKey, mode: "insensitive" } },
          ],
        },
      }),
    };
  }

  private async validateRemovalPermissions(
    teamId: string,
    requesterId: string,
    targetUserId: string,
  ): Promise<void> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: { id: true, ownerId: true },
    });

    if (!team) {
      this.teamResponseHelper.throwNotFound("Team not found");
    }

    // Prevent self-removal
    if (requesterId === targetUserId) {
      this.teamResponseHelper.throwBadRequest(
        "You cannot remove yourself from the team",
      );
    }

    // Cannot remove the owner
    if (targetUserId === team.ownerId) {
      this.teamResponseHelper.throwBadRequest(
        "You cannot remove the team owner",
      );
    }

    // Ensure requester has permissions
    const isOwner = requesterId === team.ownerId;
    const isAdmin = await this.isTeamAdmin(teamId, requesterId);

    if (!isOwner && !isAdmin) {
      this.teamResponseHelper.throwForbidden(
        "You don't have permission to remove members",
      );
    }

    // Ensure target is a member
    if (!(await this.isTeamMember(teamId, targetUserId))) {
      this.teamResponseHelper.throwNotFound(
        "User is not a member of this team",
      );
    }
  }

  private async validateBulkRemovalPermissions(
    teamId: string,
    requesterId: string,
    targetIds: string[],
  ): Promise<void> {
    // Prevent self-removal
    if (targetIds.includes(requesterId)) {
      this.teamResponseHelper.throwBadRequest(
        "You cannot remove yourself from the team",
      );
    }

    // Check requester is admin
    if (!(await this.isTeamAdmin(teamId, requesterId))) {
      this.teamResponseHelper.throwForbidden(
        "Only team admins can remove members",
      );
    }
  }
}
