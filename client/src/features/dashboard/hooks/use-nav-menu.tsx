import { LayoutDashboard, ListCheck, Users } from "lucide-react";
import { usePathname } from "next/navigation";

import { dashboardRoutes } from "@/config";
import { useCurrentTeam } from "@/teams/hooks";
import { NavItem } from "@/types/ui";

export const useNavMenu = (): NavItem[] => {
  const { currentTeam } = useCurrentTeam();
  const pathname = usePathname();

  const dashboardNav: NavItem[] = [
    {
      href: dashboardRoutes.dashboard,
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: dashboardRoutes.teams,
      icon: Users,
      label: "Teams",
    },
    {
      href: dashboardRoutes.tasks(currentTeam?.id ?? "#"),
      icon: ListCheck,
      label: "Tasks",
    },
  ].map((item) => ({
    ...item,
    isActive:
      pathname === item.href ||
      (pathname.startsWith(item.href) &&
        item.href !== dashboardRoutes.dashboard),
  }));

  return dashboardNav;
};
