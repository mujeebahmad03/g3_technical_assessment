import { DashboardLayoutContent } from "@/dashboard/components/layout";
import { KanbanBoardEnhanced } from "@/tasks/components";

import { dashboardRoutes } from "@/config";

export default async function Page({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  const crumbs = [
    { label: "Home", href: dashboardRoutes.dashboard },
    { label: "Tasks", href: dashboardRoutes.tasks(teamId) },
  ];

  return (
    <DashboardLayoutContent breadcrumbs={crumbs} currentPage="Overview">
      <KanbanBoardEnhanced teamId={teamId} />
    </DashboardLayoutContent>
  );
}
