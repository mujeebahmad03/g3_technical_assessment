import { ServerProtectedRoute } from "@/shared/guards";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <ServerProtectedRoute>{children}</ServerProtectedRoute>;
};

export default DashboardLayout;
