"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/features/auth/hooks/use-auth";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/auth.schemas";

export function RegisterForm() {
  const registerAccount = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values) =>
        registerAccount.mutate({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword
        })
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <Input label="First name" autoComplete="given-name" error={errors.firstName?.message} {...register("firstName")} />
        <Input label="Last name" autoComplete="family-name" error={errors.lastName?.message} {...register("lastName")} />
      </div>
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button className="w-full" type="submit" disabled={registerAccount.isPending}>
        <UserPlus className="h-4 w-4" />
        {registerAccount.isPending ? "Creating account" : "Create account"}
      </Button>
      <p className="text-center text-sm text-ink-500 dark:text-ink-100">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-clay">
          Sign in
        </Link>
      </p>
    </form>
  );
}
