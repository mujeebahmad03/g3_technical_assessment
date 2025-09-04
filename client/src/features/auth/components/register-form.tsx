"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  AuthHeader,
  AuthLink,
  FormDivider,
  PasswordField,
  PasswordStrengthIndicator,
} from "./shared";
import { InputFormField } from "@/components/form-fields";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";

import { registerSchema, type RegisterFormData } from "@/auth/validations";
import { authRoutes } from "@/config";
import { useAuth } from "@/shared/providers";

export function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      router.push(authRoutes.login);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  const password = form.watch("password");

  return (
    <>
      <AuthHeader title="Create your account" subtitle="" />

      <div className="my-6">
        <FormDivider />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <InputFormField
                form={form}
                name="firstName"
                placeholder="First name"
                label="First Name"
                icon={User}
                required
              />

              <InputFormField
                form={form}
                name="lastName"
                placeholder="Last name"
                label="Last Name"
                icon={User}
                required
              />
            </div>

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
            <div className="space-y-2">
              <PasswordField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Create a password"
              />
              <PasswordStrengthIndicator password={password ?? ""} />
            </div>

            {/* Confirm Password Field */}
            <PasswordField
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
            />

            <LoadingButton isLoading={isLoading} disabled={isLoading}>
              Create Account
            </LoadingButton>
          </form>
        </Form>
      </motion.div>

      <AuthLink
        text="Already have an account?"
        linkText="Sign in"
        onClick={() => router.push(authRoutes.login)}
      />
    </>
  );
}
