import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { TokenExpiredError } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { JWTHelperService } from "src/helper/jwt-helper.service";
import { AuthRequest } from "../interfaces";
import { UserSelect } from "src/types/auth.types";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtHelper: JWTHelperService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Access token is required");
    }

    try {
      const jwtResponse = await this.jwtHelper.readToken(token);

      if (!jwtResponse) {
        throw new UnauthorizedException("Invalid access token");
      }

      // Fetch user details with proper typing
      const user = await this.prisma.user.findUnique({
        where: { id: jwtResponse.sub },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          bio: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      request.user = user as UserSelect;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException("Access token has expired");
      }
      throw new UnauthorizedException("Invalid access token");
    }
  }

  private extractTokenFromHeader(request: AuthRequest): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(" ");
    return type === "Bearer" ? token : undefined;
  }
}
