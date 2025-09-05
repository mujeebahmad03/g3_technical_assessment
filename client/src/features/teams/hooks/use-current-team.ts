import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserTeam } from "@/teams/types";

interface CurrentTeamState {
  currentTeam: UserTeam | null;
  setCurrentTeam: (team: UserTeam | null) => void;
}

export const useCurrentTeam = create<CurrentTeamState>()(
  persist(
    (set) => ({
      currentTeam: null,
      setCurrentTeam: (team) => set({ currentTeam: team }),
    }),
    {
      name: "current-team-storage",
    }
  )
);
