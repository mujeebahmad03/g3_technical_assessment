import React, { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authRoutes } from "@/config";

// Server-side auth check utility
export async function getServerAuthState(): Promise<{
  isAuthenticated: boolean;
  accessToken: string | null;
}> {
  try {
    const cookieStore = await cookies();
    const encryptedToken = cookieStore.get("accessToken")?.value;

    if (!encryptedToken) {
      return { isAuthenticated: false, accessToken: null };
    }

    // We can't decrypt on server side easily, so we just check if cookie exists
    // The actual token validation will happen when the API is called
    return { isAuthenticated: true, accessToken: encryptedToken };
  } catch (error) {
    console.error("Server auth check failed:", error);
    return { isAuthenticated: false, accessToken: null };
  }
}

// Server Component Auth Guard
interface ServerAuthGuardProps {
  children: ReactNode;
}

export async function ServerProtectedRoute({ children }: ServerAuthGuardProps) {
  const { isAuthenticated } = await getServerAuthState();

  if (!isAuthenticated) {
    redirect(authRoutes.login);
  }

  return <>{children}</>;
}

export async function ServerGuestRoute({ children }: ServerAuthGuardProps) {
  const { isAuthenticated } = await getServerAuthState();

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
