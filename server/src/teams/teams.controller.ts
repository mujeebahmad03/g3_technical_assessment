import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
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
import { TeamsService } from "./teams.service";
import {
  CreateTeamDto,
  InviteUserDto,
  TeamResponseModel,
  TeamMemberResponseModel,
  InvitationResponseModel,
} from "./dto";
import { UserSelect } from "src/types/auth.types";
import { QueryOptionsDto } from "src/common/dto";

@ApiTags("Teams")
@ApiBearerAuth()
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
              items: { $ref: getSchemaPath(TeamResponseModel) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getUserTeams(
    @CurrentUser() user: UserSelect,
  ): Promise<ResponseModel<TeamResponseModel[]>> {
    return this.teamsService.getUserTeams(user.id);
  }

  @Get(":teamId/members")
  @UseGuards(TeamAccessGuard)
  @RequireTeamAccess()
  @ApiOperation({ summary: "Get team members by team ID" })
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
  @UseGuards(TeamManagementGuard)
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

  @Get("invitations/pending")
  @ApiOperation({ summary: "Get pending invitations for the current user" })
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
  async getPendingInvitations(
    @CurrentUser() user: UserSelect,
  ): Promise<ResponseModel<InvitationResponseModel[]>> {
    return this.teamsService.getPendingInvitations(user.id);
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
}
