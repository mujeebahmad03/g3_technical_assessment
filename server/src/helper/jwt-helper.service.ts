import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import * as argon from "argon2";

import { JWTPayload, JWTResponse } from "src/models/jwt-payload.model";
import { PrismaService } from "src/prisma/prisma.service";
import { HelperService } from "./helper.service";

@Injectable()
export class JWTHelperService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly helperService: HelperService,
    private readonly prisma: PrismaService,
  ) {}

  responseJwt = (response: JWTResponse): JWTResponse => response;

  async signToken(payload: JWTPayload, expiresIn: string): Promise<string> {
    const secret = this.config.getOrThrow<string>("JWT_SECRET");
    return this.jwt.signAsync(payload, {
      expiresIn,
      secret,
    });
  }

  async signRefreshToken(payload: JWTPayload): Promise<string | null> {
    try {
      const secret = this.config.getOrThrow<string>("JWT_REFRESH_SECRET");
      const expiresIn = this.config.getOrThrow<string>(
        "JWT_REFRESH_EXPIRATION",
      );
      const refreshToken = await this.jwt.signAsync(payload, {
        expiresIn,
        secret,
      });

      const expiresInMs = this.helperService.convertToMilliseconds(expiresIn);
      const expiresAt = new Date(Date.now() + expiresInMs);

      const hashedToken = await argon.hash(refreshToken);
      await this.prisma.refreshToken.upsert({
        create: {
          token: hashedToken,
          userId: payload.sub,
          expiresAt,
          isRevoked: false,
        },
        where: { userId: payload.sub },
        update: { token: hashedToken, expiresAt, isRevoked: false },
      });

      return refreshToken;
    } catch (error) {
      console.error("Error signing refresh token:", error);
      return null;
    }
  }

  async readToken(token: string): Promise<JWTResponse | null> {
    try {
      const secret = this.config.get<string>("JWT_SECRET");
      const payload = await this.jwt.verifyAsync<JWTPayload>(token, { secret });

      const res = {
        expiryTime: new Date((payload.exp || 0) * 1000),
        initiationTime: new Date((payload.iat || 0) * 1000),
        ...payload,
        data: payload.sub,
      };

      return this.responseJwt(res);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        console.log("Access token has expired");
        throw error;
      }
      console.log("Error while reading token:", error);
      return null;
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const secret = this.config.get<string>("JWT_REFRESH_SECRET");
      const payload = await this.jwt.verifyAsync<JWTPayload>(refreshToken, {
        secret,
      });

      const { sub: userId } = payload;

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { userId, isRevoked: false },
      });

      if (!storedToken)
        throw new UnauthorizedException("Refresh token not found");

      const isValid = await argon.verify(storedToken.token, refreshToken);
      if (!isValid) throw new UnauthorizedException("Invalid refresh token");

      if (new Date() > storedToken.expiresAt)
        throw new UnauthorizedException("Refresh token has expired");

      const newAccessToken = await this.signToken(
        {
          sub: userId,
          requestType: payload.requestType,
        },
        this.config.get<string>("JWT_EXPIRATION") as string,
      );

      return newAccessToken;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException("Refresh token has expired");
      }
      throw new UnauthorizedException(
        "An error occurred while refreshing the access token",
      );
    }
  }
}
