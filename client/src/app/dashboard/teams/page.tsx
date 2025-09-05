import { DashboardLayoutContent } from "@/dashboard/components/layout";
import { TeamsOverview } from "@/teams/components";

import { dashboardRoutes } from "@/config";

const crumbs = [
  { label: "Home", href: dashboardRoutes.dashboard },
  { label: "Teams", href: dashboardRoutes.teams },
];

const TeamsPage = async () => {
  return (
    <DashboardLayoutContent breadcrumbs={crumbs} currentPage="Overview">
      <TeamsOverview />
    </DashboardLayoutContent>
  );
};

export default TeamsPage;
