import { Injectable } from "@nestjs/common";
import { ResponseHelperService } from "src/helper/response-helper.service";
import { UserResponseModel } from "src/models/auth.model";
import { ResponseModel } from "src/models/global.model";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserProfileDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseHelper: ResponseHelperService<UserResponseModel>,
  ) {}

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<ResponseModel<UserResponseModel>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
      this.responseHelper.throwNotFound("User not found");
    }

    return this.responseHelper.returnSuccessObject(
      "User profile retrieved successfully",
      user,
    );
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: UpdateUserProfileDto,
  ): Promise<ResponseModel<UserResponseModel>> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!existingUser) {
      this.responseHelper.throwNotFound("User not found");
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
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

    return this.responseHelper.returnSuccessObject(
      "User profile updated successfully",
      updatedUser,
    );
  }
}
