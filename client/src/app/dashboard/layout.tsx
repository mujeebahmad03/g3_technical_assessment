import { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/dashboard/components/layout";
import { ServerProtectedRoute } from "@/shared/guards";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ServerProtectedRoute>
      <SidebarProvider>
        <AppSidebar />

        {children}
      </SidebarProvider>
    </ServerProtectedRoute>
  );
};

export default DashboardLayout;
