import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { AuthRequest } from "../interfaces";
import { Role } from "prisma/generated/prisma/enums";

@Injectable()
export class TeamManagementGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const teamMember = request.teamMember;

    if (!teamMember) {
      throw new ForbiddenException("Team membership required");
    }

    if (teamMember.role !== Role.ADMIN) {
      throw new ForbiddenException(
        "Admin role required for team management operations",
      );
    }

    return true;
  }
}
