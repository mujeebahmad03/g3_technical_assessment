export const authRoutes = {
  login: "/login",
  register: "/register",
} as const;

const privateRoute = "/dashboard";

export const dashboardRoutes = {
  dashboard: privateRoute,
  teams: `${privateRoute}/teams`,
  members: (teamId: string) => `${dashboardRoutes.teams}/${teamId}/members`,
  tasks: (teamId: string) => `${dashboardRoutes.teams}/${teamId}/tasks`,
  profile: `${privateRoute}/profile`,
} as const;
