import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiRoutes } from "@/config";
import { api } from "@/lib/api";
import type { Team } from "@/teams/types";
import type { CreateTeamFormValues } from "@/teams/validations";

export function useTeams() {
  const queryClient = useQueryClient();

  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: async () => api.getPaginated<Team>(apiRoutes.teams.getTeams),
    select: (data) => data.data,
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
