"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiRoutes } from "@/config";
import { api } from "@/lib/api";
import { QueryOptions } from "@/types/api-response";
import {
  BulkInvitePayload,
  BulkRemovePayload,
  InviteUserPayload,
  TeamMember,
  TeamMembersFilters,
} from "@/teams/types";

export function useTeamMembers(teamId: string, filters?: TeamMembersFilters) {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ["team-members", teamId, filters],
    queryFn: () =>
      api.getPaginated<TeamMember>(
        apiRoutes.teams.getTeamMembers(teamId),
        filters
      ),
    enabled: !!teamId,
  });

  const inviteUserMutation = useMutation({
    mutationFn: (payload: InviteUserPayload) =>
      api.post(apiRoutes.teams.inviteUser(teamId), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const bulkInviteMutation = useMutation({
    mutationFn: (payload: BulkInvitePayload) =>
      api.post(apiRoutes.teams.bulkInviteUsers(teamId), payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const removeUserMutation = useMutation({
    mutationFn: (userId: string) =>
      api.delete(apiRoutes.teams.removeUser(teamId, userId)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const bulkRemoveMutation = useMutation({
    mutationFn: (payload: BulkRemovePayload) =>
      api.delete(apiRoutes.teams.bulkRemoveUsers(teamId), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  return {
    members: membersQuery.data?.data || [],
    meta: membersQuery.data?.meta,
    isLoading: membersQuery.isLoading,
    error: membersQuery.error,
    inviteUser: inviteUserMutation.mutate,
    isInviting: inviteUserMutation.isPending,
    bulkInvite: bulkInviteMutation.mutate,
    isBulkInviting: bulkInviteMutation.isPending,
    removeUser: removeUserMutation.mutateAsync,
    isRemoving: removeUserMutation.isPending,
    bulkRemove: bulkRemoveMutation.mutateAsync,
    isBulkRemoving: bulkRemoveMutation.isPending,
  };
}
