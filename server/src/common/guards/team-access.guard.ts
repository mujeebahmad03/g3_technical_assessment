import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/prisma/prisma.service";
import { REQUIRE_TEAM_ACCESS_KEY } from "../decorators";
import { TypedAuthRequest } from "../interfaces";
import { TeamMemberWithRelations } from "src/types/auth.types";

@Injectable()
export class TeamAccessGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireTeamAccess = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_TEAM_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireTeamAccess) {
      return true; // No team access required
    }

    const request = context.switchToHttp().getRequest<TypedAuthRequest>();
    const user = request.user;
    const teamId = (request.params.teamId ||
      request.body.teamId ||
      request.query.teamId) as string;

    if (!teamId) {
      throw new ForbiddenException("Team ID is required");
    }

    if (!user) {
      throw new ForbiddenException("User authentication required");
    }

    // Check if user is a member of the team with proper typing
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            bio: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!teamMember) {
      throw new ForbiddenException(
        "Access denied: You are not  a member of this team",
      );
    }

    // Attach team member info to request for use in subsequent guards/controllers
    request.teamMember = teamMember as TeamMemberWithRelations;
    return true;
  }
}
