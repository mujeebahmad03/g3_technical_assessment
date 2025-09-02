import { Controller, UseGuards, Body, Get, Patch } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserProfileDto } from "./dto";
import { CurrentUser } from "src/common/decorators";
import { JwtAuthGuard } from "src/common/guards";
import { UserSelect } from "src/types/auth.types";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: UserSelect) {
    return this.usersService.getProfile(user.id);
  }

  /**
   * Update user profile
   */
  @Patch("update-profile")
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: UserSelect,
    @Body() data: UpdateUserProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, data);
  }
}
