import type { ReactNode } from "react";

import type { CrumbItem } from "@/types/ui";

export interface DashboardHeaderProps {
  breadcrumbs: CrumbItem[];
  currentPage: string;
}

export interface DashboardLayoutContentProps extends DashboardHeaderProps {
  children: ReactNode;
}
