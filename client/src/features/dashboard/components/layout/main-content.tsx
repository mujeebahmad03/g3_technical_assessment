import { SidebarInset } from "@/components/ui/sidebar";

import { DashboardHeader } from "./dashboard-header";
import type { DashboardLayoutContentProps } from "@/dashboard/types";

export const DashboardLayoutContent = ({
  children,
  breadcrumbs,
  currentPage,
}: DashboardLayoutContentProps) => {
  return (
    <SidebarInset className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader breadcrumbs={breadcrumbs} currentPage={currentPage} />
      <div className="flex-1 overflow-auto">{children}</div>
    </SidebarInset>
  );
};
