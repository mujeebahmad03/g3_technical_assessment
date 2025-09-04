"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { AuthHeader, AuthLink, PasswordField } from "./shared";
import { InputFormField } from "@/components/form-fields";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";

import { loginSchema, type LoginFormData } from "@/auth/validations";
import { authRoutes, dashboardRoutes } from "@/config";
import { useAuth } from "@/shared/providers";

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      router.push(dashboardRoutes.dashboard);
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <>
      <AuthHeader title="Welcome back" subtitle="Login in to your account" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <InputFormField
              form={form}
              name="email"
              placeholder="Email"
              icon={Mail}
              type="email"
              label="Email Address"
              required
            />

            {/* Password Field */}
            <PasswordField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-primary text-sm transition-colors hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <LoadingButton isLoading={isLoading} disabled={isLoading}>
              Login
            </LoadingButton>
          </form>
        </Form>
      </motion.div>

      <AuthLink
        text="Don't have an account?"
        linkText="Sign up"
        onClick={() => router.push(authRoutes.register)}
      />
    </>
  );
}
