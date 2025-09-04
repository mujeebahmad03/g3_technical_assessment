"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type React from "react";

import { apiRoutes } from "@/config";
import { TokenStorage, api } from "@/lib/api";
import { LoginResponse, RegisterResponse, User } from "@/types/auth";
import { LoginFormData, RegisterFormData } from "@/auth/validations";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (credentials: LoginFormData) => {
    try {
      const response = await api.post<LoginResponse>(
        apiRoutes.auth.login,
        credentials
      );

      const { user: userData, accessToken, refreshToken } = response;

      TokenStorage.setTokens({ accessToken, refreshToken });
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterFormData) => {
    try {
      const response = await api.post<RegisterResponse>(
        apiRoutes.auth.register,
        userData
      );
      const { user: newUser } = response;

      setUser(newUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    TokenStorage.clearTokens();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await api.get<User>(apiRoutes.users.getProfile);
      setUser(profile);
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = await TokenStorage.getAccessToken();
      if (token) {
        await refreshUser();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
