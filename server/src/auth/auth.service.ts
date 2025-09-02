import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JWTHelperService } from "src/helper/jwt-helper.service";
import { HelperService } from "src/helper/helper.service";
import { JWTPayload, JWTRequestType } from "src/models/jwt-payload.model";
import { UserSelect } from "src/types/auth.types";
import * as argon from "argon2";
import { LoginDto, RefreshTokenDto, RegisterDto } from "./dto";
import { ResponseHelperService } from "src/helper/response-helper.service";
import { AuthResponseModel } from "src/models/auth.model";
import { ResponseModel } from "src/models/global.model";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtHelper: JWTHelperService,
    private readonly helperService: HelperService,
    private readonly responseHelper: ResponseHelperService<AuthResponseModel>,
  ) {}

  /**
   * Register a new user
   */
  async register(
    registerDto: RegisterDto,
  ): Promise<ResponseModel<AuthResponseModel>> {
    const { email, username, password, firstName, lastName } = registerDto;

    // Check if user already exists
    await this.checkUserExists(email, username);

    // Hash password
    const hashedPassword = await argon.hash(password);

    // Create user
    await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        hashedPassword,
        firstName,
        lastName,
      },
    });

    return this.responseHelper.returnSuccessObject(
      "User registered successfully",
    );
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<ResponseModel<AuthResponseModel>> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      this.responseHelper.throwUnauthorized("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await argon.verify(user.hashedPassword, password);

    if (!isPasswordValid) {
      this.responseHelper.throwUnauthorized("Invalid credentials");
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    // Update last login
    await this.updateLastLogin(user.id);

    // Return user data without sensitive information
    const userSelect: UserSelect = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      bio: user.bio,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return this.responseHelper.returnSuccessObject(
      "User logged in successfully",
      {
        user: userSelect,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    );
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenDto;

    if (this.helperService.isStringEmptyOrNull(refreshToken)) {
      this.responseHelper.throwBadRequest("Refresh token is required");
    }

    try {
      const accessToken = await this.jwtHelper.refreshAccessToken(refreshToken);
      return { accessToken };
    } catch {
      this.responseHelper.throwUnauthorized("Invalid or expired refresh token");
    }
  }

  /**
   * Logout user (revoke refresh token)
   */
  async logout(userId: string): Promise<ResponseModel<AuthResponseModel>> {
    try {
      await this.prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });

      return this.responseHelper.returnSuccessObject("Successfully logged out");
    } catch {
      this.responseHelper.throwBadRequest("Failed to logout");
    }
  }

  /**
   * Check if user already exists
   */
  private async checkUserExists(
    email: string,
    username: string,
  ): Promise<void> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        this.responseHelper.throwConflict("Email already exists");
      }

      if (existingUser.username === username.toLowerCase()) {
        this.responseHelper.throwConflict("Username already exists");
      }
    }
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JWTPayload = {
      sub: userId,
      requestType: JWTRequestType.Login,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtHelper.signToken(payload, process.env.JWT_EXPIRATION || "15m"),
      this.jwtHelper.signRefreshToken(payload),
    ]);

    if (!refreshToken) {
      this.responseHelper.throwBadRequest("Failed to generate refresh token");
    }

    return { accessToken, refreshToken };
  }

  /**
   * Update user's last login timestamp
   */
  private async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }
}
