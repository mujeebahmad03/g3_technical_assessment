import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

import { apiRoutes } from "@/config";
import { api } from "@/lib/api";
import type { UserTeam } from "@/teams/types";
import { getTeamLogo } from "@/teams/utils";
import type { CreateTeamFormValues } from "@/teams/validations";

export function useTeams() {
  const queryClient = useQueryClient();

  const teamsQuery: UseQueryResult<UserTeam[]> = useQuery({
    queryKey: ["teams"],
    queryFn: async () => api.getPaginated<UserTeam>(apiRoutes.teams.getTeams),
    select: (data) =>
      data.data.map((team) => ({
        ...team,
        logo: getTeamLogo(team.id),
      })),
  });

  const createTeamMutation = useMutation({
    mutationFn: (payload: CreateTeamFormValues) =>
      api.post(apiRoutes.teams.createTeam, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  return {
    teams: teamsQuery.data || [],
    isLoading: teamsQuery.isLoading,
    error: teamsQuery.error,
    createTeam: createTeamMutation.mutate,
    isCreating: createTeamMutation.isPending,
  };
}
