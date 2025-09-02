import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "prisma/generated/prisma/enums";
import { ROLES_KEY } from "../decorators";
import { AuthRequest } from "../interfaces";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const teamMember = request.teamMember;

    if (!teamMember) {
      throw new ForbiddenException("Team membership required");
    }

    const hasRole = requiredRoles.includes(teamMember.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Required role: ${requiredRoles.join(" or ")}. Current role: ${teamMember.role}`,
      );
    }

    return true;
  }
}
