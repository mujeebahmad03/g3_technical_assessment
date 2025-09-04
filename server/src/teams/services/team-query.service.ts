import { Injectable } from "@nestjs/common";
import { PaginationHelperService } from "src/helper/pagination-helper.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UserTeamResponseModel } from "../dto";
import { HelperService } from "src/helper/helper.service";
import { QueryOptionsDto } from "src/common/dto";
import { ResponseModel } from "src/models/global.model";
import { Prisma } from "prisma/generated/prisma/client";
import { RawUserTeam } from "../types";

@Injectable()
export class TeamQueryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseHelper: PaginationHelperService<
      UserTeamResponseModel[]
    >,
    private readonly helperService: HelperService,
  ) {}

  async getUserTeams(
    userId: string,
    query?: QueryOptionsDto,
  ): Promise<ResponseModel<UserTeamResponseModel[]>> {
    const { limit = 10, page = 1, searchKey = "" } = query || {};
    const skip = (page - 1) * limit;

    const whereClause = this.buildUserTeamsQuery(userId, searchKey);

    const [teams, count] = await Promise.all([
      this.prisma.team.findMany({
        where: whereClause,
        include: {
          members: { where: { userId }, select: { role: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.team.count({ where: whereClause }),
    ]);

    const pagination = this.helperService.paginate(count, page, limit);

    return this.responseHelper.returnSuccessObjectWithPagination(
      "User teams retrieved successfully",
      this.transformTeams(teams),
      pagination,
    );
  }

  private buildUserTeamsQuery(
    userId: string,
    searchKey: string,
  ): Prisma.TeamWhereInput {
    return {
      members: {
        some: { userId },
      },
      isArchived: false,
      ...(searchKey && {
        OR: [
          { name: { contains: searchKey, mode: "insensitive" } },
          { slug: { contains: searchKey, mode: "insensitive" } },
          { description: { contains: searchKey, mode: "insensitive" } },
        ],
      }),
    };
  }

  private transformTeams(teams: RawUserTeam[]): UserTeamResponseModel[] {
    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      slug: team.slug,
      description: team.description,
      isArchived: team.isArchived,
      ownerId: team.ownerId,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      role: team.members[0]?.role ?? null,
    }));
  }
}
