"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/features/auth/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/auth.schemas";

export function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/orders";
  const login = useLogin(nextPath);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  return (
    <form className="space-y-5" onSubmit={handleSubmit((values) => login.mutate(values))}>
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button className="w-full" type="submit" disabled={login.isPending}>
        <LogIn className="h-4 w-4" />
        {login.isPending ? "Signing in" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-ink-500 dark:text-ink-100">
        New here?{" "}
        <Link href="/register" className="font-semibold text-clay">
          Create an account
        </Link>
      </p>
    </form>
  );
}
