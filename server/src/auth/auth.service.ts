import { Injectable, Logger } from "@nestjs/common";
import * as argon from "argon2";
import { PrismaService } from "src/prisma/prisma.service";
import { JWTHelperService } from "src/helper/jwt-helper.service";
import { HelperService } from "src/helper/helper.service";
import { JWTPayload, JWTRequestType } from "src/models/jwt-payload.model";
import { UserSelect } from "src/types/auth.types";
import { LoginDto, RefreshTokenDto, RegisterDto } from "./dto";
import { ResponseHelperService } from "src/helper/response-helper.service";
import {
  AuthResponseModel,
  RefreshTokenResponseModel,
} from "src/models/auth.model";
import { ResponseModel } from "src/models/global.model";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtHelper: JWTHelperService,
    private readonly helperService: HelperService,
    private readonly responseHelper: ResponseHelperService<AuthResponseModel>,
    private readonly refreshTokenResponseHelper: ResponseHelperService<RefreshTokenResponseModel>,
  ) {}

  /**
   * Register a new user
   */
  async register(
    registerDto: RegisterDto,
  ): Promise<ResponseModel<AuthResponseModel>> {
    const { email, username, password, firstName, lastName } = registerDto;

    this.logger.log(`Attempting to register user with email: ${email}`);

    // Check if user already exists
    await this.checkUserExists(email, username);

    // Hash password
    const hashedPassword = await argon.hash(password);

    // Create user
    const newUser = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        hashedPassword,
        firstName,
        lastName,
      },
    });

    this.logger.log(`User registered successfully with ID: ${newUser.id}`);

    return this.responseHelper.returnSuccessObject(
      "User registered successfully",
    );
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<ResponseModel<AuthResponseModel>> {
    const { email, password } = loginDto;

    this.logger.log(`Login attempt for email: ${email}`);

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      this.logger.warn(`Login failed: No user found for email: ${email}`);
      this.responseHelper.throwUnauthorized("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await argon.verify(user.hashedPassword, password);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for email: ${email}`);
      this.responseHelper.throwUnauthorized("Invalid credentials");
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    // Update last login
    await this.updateLastLogin(user.id);
    this.logger.log(`User logged in successfully: ${user.id}`);

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
  ): Promise<ResponseModel<RefreshTokenResponseModel>> {
    const { refreshToken } = refreshTokenDto;

    this.logger.log(`Refreshing access token...`);

    if (this.helperService.isStringEmptyOrNull(refreshToken)) {
      this.logger.warn("Refresh token not provided");
      this.responseHelper.throwBadRequest("Refresh token is required");
    }

    try {
      const accessToken = await this.jwtHelper.refreshAccessToken(refreshToken);
      this.logger.log("Access token refreshed successfully");

      return this.refreshTokenResponseHelper.returnSuccessObject(
        "Access token refreshed successfully",
        { accessToken },
      );
    } catch (err) {
      this.logger.error("Failed to refresh access token", err.stack);
      this.responseHelper.throwUnauthorized("Invalid or expired refresh token");
    }
  }

  /**
   * Logout user (revoke refresh token)
   */
  async logout(userId: string): Promise<ResponseModel<AuthResponseModel>> {
    this.logger.log(`Logging out user: ${userId}`);

    try {
      await this.prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });

      this.logger.log(`User ${userId} logged out successfully`);

      return this.responseHelper.returnSuccessObject("Successfully logged out");
    } catch (err) {
      this.logger.error(`Failed to logout user: ${userId}`, err.stack);
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
    this.logger.log(
      `Checking if user exists with email: ${email} or username: ${username}`,
    );

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
        this.logger.warn(
          `Registration failed: Email already exists - ${email}`,
        );
        this.responseHelper.throwConflict("Email already exists");
      }

      if (existingUser.username === username.toLowerCase()) {
        this.logger.warn(
          `Registration failed: Username already exists - ${username}`,
        );
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
    this.logger.log(`Generating tokens for user: ${userId}`);

    const payload: JWTPayload = {
      sub: userId,
      requestType: JWTRequestType.Login,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtHelper.signToken(payload, process.env.JWT_EXPIRATION || "15m"),
      this.jwtHelper.signRefreshToken(payload),
    ]);

    if (!refreshToken) {
      this.logger.error("Failed to generate refresh token");
      this.responseHelper.throwBadRequest("Failed to generate refresh token");
    }

    this.logger.log(`Tokens generated successfully for user: ${userId}`);
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
    this.logger.log(`Updated last login for user: ${userId}`);
  }
}
