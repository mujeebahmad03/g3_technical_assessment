"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { authRoutes } from "@/config";
import { useAuth } from "@/shared/providers";

interface ClientAuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Client-side protected route component
export const ClientProtectedRoute: React.FC<ClientAuthGuardProps> = ({
  children,
  fallback,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the current path to redirect back after login
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== authRoutes.login) {
        sessionStorage.setItem("redirectAfterLogin", currentPath);
      }
      router.push(authRoutes.login);
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading fallback while checking auth
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

// Client-side guest route component
export const ClientGuestRoute: React.FC<ClientAuthGuardProps> = ({
  children,
  fallback,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if there's a redirect path stored
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading fallback while checking auth
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )
    );
  }

  // Show nothing while redirecting
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
