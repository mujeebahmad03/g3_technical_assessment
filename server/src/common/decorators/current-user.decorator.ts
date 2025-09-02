import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserSelect } from "src/types/auth.types";
import { AuthRequest } from "../interfaces";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserSelect => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
