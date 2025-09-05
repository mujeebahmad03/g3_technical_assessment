import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import {
  JwtAuthGuard,
  TeamAccessGuard,
  TeamManagementGuard,
} from "src/common/guards";
import { CurrentUser, RequireTeamAccess } from "src/common/decorators";
import { ResponseModel } from "src/models/global.model";
import { TeamsService } from "./services";
import {
  CreateTeamDto,
  InviteUserDto,
  TeamResponseModel,
  TeamMemberResponseModel,
  InvitationResponseModel,
  BulkRemoveUserDto,
  BulkInviteDto,
  UserTeamResponseModel,
} from "./dto";
import { UserSelect } from "src/types/auth.types";
import { QueryOptionsDto } from "src/common/dto";

@ApiTags("Teams")
@ApiBearerAuth()
@ApiExtraModels(
  BulkInviteDto,
  BulkRemoveUserDto,
  CreateTeamDto,
  InviteUserDto,
  TeamResponseModel,
  QueryOptionsDto,
  TeamMemberResponseModel,
  InvitationResponseModel,
  ResponseModel,
  UserTeamResponseModel,
)
@UseGuards(JwtAuthGuard)
@Controller("teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new team" })
  @ApiResponse({
    status: 201,
    description: "Team created successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              items: { $ref: getSchemaPath(TeamResponseModel) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createTeam(
    @CurrentUser() user: UserSelect,
    @Body() createTeamDto: CreateTeamDto,
  ): Promise<ResponseModel<TeamResponseModel>> {
    return this.teamsService.createTeam(user.id, createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all teams for the current user" })
  @ApiResponse({
    status: 200,
    description: "User teams retrieved successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(UserTeamResponseModel) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getUserTeams(
    @CurrentUser() user: UserSelect,
  ): Promise<ResponseModel<UserTeamResponseModel[]>> {
    return this.teamsService.getUserTeams(user.id);
  }

  @Get(":teamId/members")
  @UseGuards(TeamAccessGuard)
  @RequireTeamAccess()
  @ApiOperation({ summary: "Get team members by team ID" })
  @ApiQuery({ name: "queryOptions", type: QueryOptionsDto, required: false })
  @ApiResponse({
    status: 200,
    description: "Team members retrieved successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(TeamMemberResponseModel) },
            },
            pagination: {
              type: "object",
              properties: {
                total: { type: "number", example: 25 },
                page: { type: "number", example: 1 },
                limit: { type: "number", example: 10 },
                totalPages: { type: "number", example: 3 },
              },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Not a team member" })
  @ApiResponse({ status: 404, description: "Team not found" })
  async getTeamMembers(
    @Param("teamId") teamId: string,
    @CurrentUser() user: UserSelect,
    @Query() query: QueryOptionsDto,
  ): Promise<ResponseModel<TeamMemberResponseModel[]>> {
    return this.teamsService.getTeamMembers(teamId, user.id, query);
  }

  @Post(":teamId/invite")
  @RequireTeamAccess()
  @UseGuards(TeamAccessGuard, TeamManagementGuard)
  @ApiOperation({
    summary: "Invite a user to a team by email or username",
    description:
      "Team admins can invite users by providing either their email address or username",
  })
  @ApiResponse({
    status: 201,
    description: "User invited to team successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              items: { $ref: getSchemaPath(InvitationResponseModel) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - User already member or has pending invitation",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Not a team admin" })
  @ApiResponse({ status: 404, description: "Team or user not found" })
  async inviteUserToTeam(
    @Param("teamId") teamId: string,
    @CurrentUser() user: UserSelect,
    @Body() inviteUserDto: InviteUserDto,
  ): Promise<ResponseModel<InvitationResponseModel>> {
    return this.teamsService.inviteUserToTeam(teamId, user.id, inviteUserDto);
  }

  @Get("invitations")
  @ApiOperation({ summary: "Get pending invitations for the current user" })
  @ApiQuery({ name: "queryOptions", type: QueryOptionsDto, required: false })
  @ApiResponse({
    status: 200,
    description: "Pending invitations retrieved successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(InvitationResponseModel) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getInvitations(
    @CurrentUser() user: UserSelect,
    @Query() query: QueryOptionsDto,
  ): Promise<ResponseModel<InvitationResponseModel[]>> {
    return this.teamsService.getInvitations(user.id, query);
  }

  @Post("invitations/:invitationId/accept")
  @ApiOperation({ summary: "Accept a team invitation" })
  @ApiResponse({
    status: 200,
    description: "Invitation accepted successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              items: { $ref: getSchemaPath(TeamMemberResponseModel) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Invitation not found" })
  async acceptInvitation(
    @Param("invitationId") invitationId: string,
    @CurrentUser() user: UserSelect,
  ) {
    return this.teamsService.acceptInvitation(invitationId, user.id);
  }

  @Post(":teamId/bulk-invite")
  @RequireTeamAccess()
  @UseGuards(TeamAccessGuard, TeamManagementGuard)
  @ApiOperation({
    summary: "Bulk invite users to a team",
    description:
      "Team admins can invite multiple users at once by providing their emails or usernames",
  })
  @ApiResponse({
    status: 201,
    description: "Users invited to team successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(InvitationResponseModel) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description:
      "Bad request - Some users already members or have pending invitations",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Not a team admin" })
  @ApiResponse({ status: 404, description: "Team not found" })
  async bulkInviteUsersToTeam(
    @Param("teamId") teamId: string,
    @CurrentUser() user: UserSelect,
    @Body() bulkInviteDto: BulkInviteDto,
  ): Promise<ResponseModel<InvitationResponseModel>> {
    return this.teamsService.bulkInviteUsersToTeam(
      teamId,
      user.id,
      bulkInviteDto,
    );
  }

  @Delete(":teamId/members/:userId")
  @RequireTeamAccess()
  @UseGuards(TeamAccessGuard, TeamManagementGuard)
  @ApiOperation({
    summary: "Remove a user from a team",
    description: "Team admins can remove a specific user from the team",
  })
  @ApiResponse({
    status: 200,
    description: "User removed from team successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "User removed successfully",
                },
              },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Not a team admin" })
  @ApiResponse({ status: 404, description: "Team or user not found" })
  async removeUserFromTeam(
    @Param("teamId") teamId: string,
    @Param("userId") userId: string,
    @CurrentUser() user: UserSelect,
  ): Promise<ResponseModel<TeamResponseModel>> {
    return this.teamsService.removeUserFromTeam(teamId, user.id, userId);
  }

  @Delete(":teamId/members/bulk")
  @RequireTeamAccess()
  @UseGuards(TeamAccessGuard, TeamManagementGuard)
  @ApiOperation({
    summary: "Bulk remove users from a team",
    description: "Team admins can remove multiple users from the team at once",
  })
  @ApiResponse({
    status: 200,
    description: "Users removed from team successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Users removed successfully",
                },
                removedCount: { type: "number", example: 3 },
              },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Not a team admin" })
  @ApiResponse({ status: 404, description: "Team not found" })
  async bulkRemoveUsersFromTeam(
    @Param("teamId") teamId: string,
    @CurrentUser() user: UserSelect,
    @Body() bulkRemoveUserDto: BulkRemoveUserDto,
  ): Promise<ResponseModel<TeamResponseModel>> {
    return this.teamsService.bulkRemoveUsersFromTeam(
      teamId,
      user.id,
      bulkRemoveUserDto,
    );
  }
}
