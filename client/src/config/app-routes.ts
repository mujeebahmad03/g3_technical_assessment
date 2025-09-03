export const authRoutes = {
  login: "/login",
  register: "/register",
} as const;

const privateRoute = "/dashboard";

export const dashboardRoutes = {
  dashboard: privateRoute,
  teams: `${privateRoute}/teams`,
  tasks: `${privateRoute}/tasks`,
  profile: `${privateRoute}/profile`,
} as const;
