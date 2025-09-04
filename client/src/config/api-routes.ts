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
} as const;
