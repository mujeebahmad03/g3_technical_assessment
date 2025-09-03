import { Injectable } from "@nestjs/common";
import { PaginationHelperService } from "src/helper/pagination-helper.service";
import { PrismaService } from "src/prisma/prisma.service";
import { TeamResponseModel } from "../dto";
import { HelperService } from "src/helper/helper.service";
import { QueryOptionsDto } from "src/common/dto";
import { ResponseModel } from "src/models/global.model";
import { Prisma } from "prisma/generated/prisma/client";

@Injectable()
export class TeamQueryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseHelper: PaginationHelperService<
      TeamResponseModel[]
    >,
    private readonly helperService: HelperService,
  ) {}

  async getUserTeams(
    userId: string,
    query?: QueryOptionsDto,
  ): Promise<ResponseModel<TeamResponseModel[]>> {
    const { limit = 10, page = 1, searchKey = "" } = query || {};
    const skip = (page - 1) * limit;

    const whereClause = this.buildUserTeamsQuery(userId, searchKey);

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

    return this.responseHelper.returnSuccessObjectWithPagination(
      "User teams retrieved successfully",
      teams,
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
}
