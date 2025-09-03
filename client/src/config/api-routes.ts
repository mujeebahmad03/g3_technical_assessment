export const apiRoutes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refreshAccessToken: "/auth/refresh-access-token",
    logout: "/auth/logout",
  },
} as const;
