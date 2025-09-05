import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { LoginDto, RefreshTokenDto, RegisterDto } from "./dto";
import { ResponseModel } from "src/models/global.model";
import {
  AuthResponseModel,
  RefreshTokenResponseModel,
} from "src/models/auth.model";
import { UserSelect } from "src/types/auth.types";

@ApiTags("Auth")
@ApiExtraModels(
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ResponseModel,
  AuthResponseModel,
  RefreshTokenResponseModel,
)
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: 201,
    description: "User registered successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(AuthResponseModel) },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: "Bad request - Validation failed" })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseModel<AuthResponseModel>> {
    return this.authService.register(registerDto);
  }

  /**
   * Login user
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(AuthResponseModel) },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: "Invalid credentials" })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ResponseModel<AuthResponseModel>> {
    return this.authService.login(loginDto);
  }

  /**
   * Refresh access token
   */
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({
    status: 200,
    description: "Access token refreshed successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(RefreshTokenResponseModel) },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: "Invalid or expired refresh token" })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ResponseModel<RefreshTokenResponseModel>> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  /**
   * Logout user
   */
  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Logout user" })
  @ApiResponse({
    status: 200,
    description: "User logged out successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { example: null },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async logout(@CurrentUser() user: UserSelect) {
    return this.authService.logout(user.id);
  }
}
