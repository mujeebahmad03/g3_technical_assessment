import type { ReactNode } from "react";

import { AuthLayout } from "@/auth/components/shared";
import { ServerGuestRoute } from "@/shared/guards";

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return (
    <ServerGuestRoute>
      <AuthLayout>{children}</AuthLayout>
    </ServerGuestRoute>
  );
}
