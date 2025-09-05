import { DashboardLayoutContent } from "@/dashboard/components/layout";
import { TeamMembers } from "@/teams/pages";

import { dashboardRoutes } from "@/config";

const crumbs = [
  { label: "Home", href: dashboardRoutes.dashboard },
  { label: "Teams", href: dashboardRoutes.teams },
];

const MembersPage = async ({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) => {
  const { teamId } = await params;

  return (
    <DashboardLayoutContent breadcrumbs={crumbs} currentPage="Members">
      <TeamMembers teamId={teamId} />
    </DashboardLayoutContent>
  );
};

export default MembersPage;
