import { Controller, UseGuards, Body, Get, Patch } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UpdateUserProfileDto } from "./dto";
import { CurrentUser } from "src/common/decorators";
import { JwtAuthGuard } from "src/common/guards";
import { UserSelect } from "src/types/auth.types";
import { ResponseModel } from "src/models/global.model";
import { UserResponseModel } from "src/models/auth.model";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get logged-in user profile
   */
  @Get("profile")
  @ApiOperation({ summary: "Get user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            items: { $ref: getSchemaPath(UserResponseModel) },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getProfile(
    @CurrentUser() user: UserSelect,
  ): Promise<ResponseModel<UserResponseModel>> {
    return this.usersService.getProfile(user.id);
  }

  /**
   * Update user profile
   */
  @Patch("update-profile")
  @ApiOperation({ summary: "Update user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile updated successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            items: { $ref: getSchemaPath(UserResponseModel) },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: "Bad request (validation failed)" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateProfile(
    @CurrentUser() user: UserSelect,
    @Body() data: UpdateUserProfileDto,
  ): Promise<ResponseModel<UserResponseModel>> {
    return this.usersService.updateProfile(user.id, data);
  }
}
