"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Github,
  Chrome,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import komponen kita
import { useAuthActions } from "@/lib/hooks/use-auth-actions";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { AuthCard } from "../components/auth-card";

export default function RegisterPage() {
  const router = useRouter();
  // Ambil fungsi dari hook
  const {
    register: registerAction,
    loginWithGoogle,
    loginWithGitHub,
    isSubmitting,
  } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    const result = await registerAction(data);

    if (result.success) {
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } else {
      toast.error("Registrasi Gagal", {
        description: result.error,
      });
    }
  };

  return (
    <AuthCard
      title="Buat Akun Baru"
      subtitle="Gabung komunitas developer CodeBox hari ini."
      backButtonLabel="Sudah punya akun? Login"
      backButtonHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              id="username"
              placeholder="johndoe"
              className={`pl-10 ${
                errors.username
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              {...register("username")}
              disabled={isSubmitting}
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-500 font-medium">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="dev@example.com"
              className={`pl-10 ${
                errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              {...register("email")}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`pl-10 pr-10 ${
                errors.password
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              {...register("password")}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className={`pl-10 ${
                errors.confirmPassword
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              {...register("confirmPassword")}
              disabled={isSubmitting}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/30 mt-2 transition-all duration-300 hover:scale-[1.01]"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mendaftar...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </Button>

        {/* Social Login Separator */}
        <div className="relative flex items-center justify-center text-xs my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative bg-white dark:bg-slate-900 px-3 text-slate-500 uppercase tracking-wider font-medium">
            atau daftar dengan
          </div>
        </div>

        {/* Google & Github Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => loginWithGitHub()}
            disabled={isSubmitting}
            className="w-full border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => loginWithGoogle()}
            disabled={isSubmitting}
            className="w-full border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Chrome className="mr-2 h-4 w-4 text-red-500" /> Google
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
