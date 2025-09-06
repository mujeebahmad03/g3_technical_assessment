"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useEffect } from "react";
import type React from "react";

import { LoginFormData, RegisterFormData } from "@/auth/validations";
import { apiRoutes, authRoutes } from "@/config";
import { TokenStorage, api } from "@/lib/api";
import { LoginResponse, RegisterResponse, User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Query keys for React Query
export const authQueryKeys = {
  user: ["auth", "user"] as const,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Check if user has valid token
  const hasValidToken = async (): Promise<boolean> => {
    const accessToken = await TokenStorage.getAccessToken();
    return !!accessToken;
  };

  // Fetch current user query
  const {
    data: user,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: authQueryKeys.user,
    queryFn: async (): Promise<User> => {
      const userData = await api.get<User>(apiRoutes.users.getProfile);
      return userData;
    },
    enabled: false, // We'll enable this manually after checking tokens
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Initialize auth state - check tokens and fetch user if valid
  const initializeAuth = async () => {
    try {
      const hasToken = await hasValidToken();
      if (hasToken) {
        await refetchUser();
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      TokenStorage.clearTokens();
      queryClient.clear();
    }
  };

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const registerMutation = useMutation({
    mutationFn: async (
      userData: RegisterFormData,
    ): Promise<RegisterResponse> => {
      return api.post<RegisterResponse>(apiRoutes.auth.register, userData);
    },
    onSuccess: async () => {
      router.push(authRoutes.login);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData): Promise<LoginResponse> => {
      return await api.post<LoginResponse>(apiRoutes.auth.login, credentials);
    },
    onSuccess: async (data) => {
      const { user: userData, accessToken, refreshToken } = data;

      // Store tokens
      await TokenStorage.setTokens({ accessToken, refreshToken });

      // Update user data in cache
      queryClient.setQueryData(authQueryKeys.user, userData);

      // Check for redirect path
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // Error toast is already handled by the api layer
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      try {
        await api.post(apiRoutes.auth.logout);
      } catch (error) {
        // Don't fail logout if API call fails
        console.warn("Logout API call failed:", error);
      }
    },
    onSuccess: () => {
      // Clear tokens and cache
      TokenStorage.clearTokens();
      queryClient.clear();

      // Redirect to login
      router.push(authRoutes.login);
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Still clear tokens and redirect even if API fails
      TokenStorage.clearTokens();
      queryClient.clear();
      router.push(authRoutes.login);
    },
  });

  const isAuthenticated = !!user;
  const authIsLoading =
    isLoading ||
    loginMutation.isPending ||
    logoutMutation.isPending ||
    registerMutation.isPending;

  const value: AuthContextType = {
    user: user || null,
    isLoading: authIsLoading,
    isAuthenticated,
    login: async (credentials: LoginFormData) => {
      await loginMutation.mutateAsync(credentials);
    },
    register: async (userData: RegisterFormData) => {
      await registerMutation.mutateAsync(userData);
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    refreshUser: async () => {
      await refetchUser();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
