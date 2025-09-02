import { SetMetadata } from "@nestjs/common";

export const REQUIRE_TEAM_ACCESS_KEY = "requireTeamAccess";
export const RequireTeamAccess = () =>
  SetMetadata(REQUIRE_TEAM_ACCESS_KEY, true);
