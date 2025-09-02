import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TeamMemberWithRelations } from "src/types/auth.types";
import { AuthRequest } from "../interfaces";

export const CurrentTeamMember = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TeamMemberWithRelations => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    if (!request.teamMember) {
      throw new Error(
        "TeamMember not found in request. Ensure TeamAccessGuard is applied.",
      );
    }
    return request.teamMember;
  },
);
