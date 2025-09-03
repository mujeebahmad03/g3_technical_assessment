import { Injectable } from "@nestjs/common";
import { ResponseHelperService } from "src/helper/response-helper.service";
import { ResponseModel } from "src/models/global.model";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTeamDto, TeamResponseModel } from "../dto";
import { Role } from "prisma/generated/prisma/enums";
import { SlugService } from "./slug.service";

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseHelper: ResponseHelperService<TeamResponseModel>,
    private readonly slugService: SlugService,
  ) {}

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
      this.responseHelper.throwNotFound("User not found");
    }

    // Check if team name already exists for this user
    const existingTeam = await this.prisma.team.findFirst({
      where: {
        ownerId: userId,
        name: data.name,
      },
    });

    if (existingTeam) {
      this.responseHelper.throwBadRequest("Team with this name already exists");
    }

    // Generate unique slug
    const uniqueSlug = await this.slugService.generateUniqueSlug(data.name);

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

    return this.responseHelper.returnSuccessObject(
      "Team created successfully",
      team,
    );
  }

  async getTeamById(teamId: string): Promise<TeamResponseModel | null> {
    return this.prisma.team.findUnique({
      where: { id: teamId },
    });
  }

  async isTeamOwner(teamId: string, userId: string): Promise<boolean> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: { ownerId: true },
    });
    return team?.ownerId === userId;
  }
}
