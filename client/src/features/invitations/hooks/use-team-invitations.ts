"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiRoutes } from "@/config";
import { api } from "@/lib/api";
import { TeamInvitation, TeamMembersFilters } from "@/teams/types";

export function useTeamInvitations(filters?: TeamMembersFilters) {
  const queryClient = useQueryClient();

  const invitationsQuery = useQuery({
    queryKey: ["invitations", filters],
    queryFn: () =>
      api.getPaginated<TeamInvitation>(
        apiRoutes.teams.getTeamInvitations,
        filters
      ),
  });

  const acceptInvitationMutation = useMutation({
    mutationFn: (invitationId: string) =>
      api.post(apiRoutes.teams.acceptInvitation(invitationId)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  return {
    invitations: invitationsQuery.data?.data || [],
    meta: invitationsQuery.data?.meta,
    isLoading: invitationsQuery.isLoading,
    error: invitationsQuery.error,
    acceptInvitation: acceptInvitationMutation.mutate,
    isAccepting: acceptInvitationMutation.isPending,
  };
}
