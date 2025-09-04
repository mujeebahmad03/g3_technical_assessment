export const apiRoutes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refreshAccessToken: "/auth/refresh-access-token",
    logout: "/auth/logout",
  },
  users: {
    getProfile: "/user/profile",
  },
  teams: {
    getTeams: "/teams",
    createTeam: "/teams",
    getTeamMembers: (teamId: string) => `/teams/${teamId}/members`,
    inviteUser: (teamId: string) => `/teams/${teamId}/invite`,
    bulkInviteUsers: (teamId: string) => `/teams/${teamId}/bulk-invite`,
    removeUser: (teamId: string, userId: string) =>
      `/teams/${teamId}/members/${userId}`,
    bulkRemoveUsers: (teamId: string) => `/teams/${teamId}/bulk-remove`,
    getTeamInvitations: "/teams/invitations",
    acceptInvitation: (invitationId: string) =>
      `/teams/invitations/${invitationId}/accept`,
  },
} as const;
