import { DashboardLayoutContent } from "@/dashboard/components/layout";
import { Invitations } from "@/invitations/page";

import { dashboardRoutes } from "@/config";

const crumbs = [
  { label: "Home", href: dashboardRoutes.dashboard },
  { label: "Invitations", href: dashboardRoutes.invitations },
];

const InvitationsPage = async () => {
  return (
    <DashboardLayoutContent
      breadcrumbs={crumbs}
      currentPage="Manage Invitations"
    >
      <Invitations />
    </DashboardLayoutContent>
  );
};

export default InvitationsPage;
