import { Module } from "@nestjs/common";
import {
  SlugService,
  TeamsService,
  TeamService,
  TeamMemberService,
  TeamInvitationService,
  TeamQueryService,
} from "./services";
import { TeamsController } from "./teams.controller";

@Module({
  controllers: [TeamsController],
  providers: [
    TeamsService,
    TeamService,
    TeamMemberService,
    TeamInvitationService,
    TeamQueryService,
    SlugService,
  ],
  exports: [TeamsService],
})
export class TeamsModule {}
