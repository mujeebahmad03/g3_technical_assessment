import { Injectable } from "@nestjs/common";
import { TeamInvitationService } from "./team-invitation.service";
import { TeamMemberService } from "./team-member.service";
import { TeamService } from "./team.service";
import { TeamQueryService } from "./team-query.service";
import { QueryOptionsDto } from "src/common/dto";
import {
  BulkInviteDto,
  BulkRemoveUserDto,
  CreateTeamDto,
  InviteUserDto,
} from "../dto";
import { QueryOptions } from "src/common/interfaces";

@Injectable()
export class TeamsService {
  constructor(
    private readonly teamService: TeamService,
    private readonly teamMemberService: TeamMemberService,
    private readonly teamInvitationService: TeamInvitationService,
    private readonly teamQueryService: TeamQueryService,
  ) {}

  // Team Management
  async createTeam(userId: string, data: CreateTeamDto) {
    return this.teamService.createTeam(userId, data);
  }

  // Member Management
  async getTeamMembers(
    teamId: string,
    userId: string,
    query?: QueryOptionsDto,
  ) {
    return this.teamMemberService.getTeamMembers(teamId, userId, query);
  }

  async removeUserFromTeam(
    teamId: string,
    requesterId: string,
    targetUserId: string,
  ) {
    return this.teamMemberService.removeUserFromTeam(
      teamId,
      requesterId,
      targetUserId,
    );
  }

  async bulkRemoveUsersFromTeam(
    teamId: string,
    requesterId: string,
    dto: BulkRemoveUserDto,
  ) {
    return this.teamMemberService.bulkRemoveUsersFromTeam(
      teamId,
      requesterId,
      dto,
    );
  }

  // Invitation Management
  async inviteUserToTeam(
    teamId: string,
    inviterId: string,
    data: InviteUserDto,
  ) {
    return this.teamInvitationService.inviteUserToTeam(teamId, inviterId, data);
  }

  async acceptInvitation(invitationId: string, userId: string) {
    return this.teamInvitationService.acceptInvitation(invitationId, userId);
  }

  async bulkInviteUsersToTeam(
    teamId: string,
    inviterId: string,
    dto: BulkInviteDto,
  ) {
    return this.teamInvitationService.bulkInviteUsersToTeam(
      teamId,
      inviterId,
      dto,
    );
  }

  async getInvitations(userId: string, query?: QueryOptions) {
    return this.teamInvitationService.getInvitations(userId, query);
  }

  // Query Operations
  async getUserTeams(userId: string, query?: QueryOptionsDto) {
    return this.teamQueryService.getUserTeams(userId, query);
  }
}
