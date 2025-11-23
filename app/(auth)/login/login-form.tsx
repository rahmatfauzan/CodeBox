"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Terminal,
  Github,
  Chrome,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Pastikan path import ini sesuai dengan struktur project Anda
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useAuthActions } from "@/lib/hooks/use-auth-actions";

export const LoginForm = () => {
  const router = useRouter();
  const { login, loginWithGoogle, loginWithGitHub, isSubmitting } =
    useAuthActions();

  const [showPassword, setShowPassword] = useState(false);
  // Note: Supabase handle session persistensi otomatis via cookies,
  // state ini bisa digunakan jika ingin mengatur expiry cookie secara manual nanti.
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      console.log("Submitting login form with data:", data);
      const result = await login(data); // Asumsi fungsi login menerima object data
      console.log("Login result:", result);
      if (result?.error) {
        toast.error("Login Gagal", {
          description: result.error,
        });
        // Jangan reset form agar user tidak perlu mengetik ulang email
        return;
      }

      if (result?.success) {
        toast.success("Selamat Datang Kembali!", {
          description: "Mengalihkan ke dashboard...",
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast.error("Terjadi Kesalahan", {
        description: "Silakan coba beberapa saat lagi.",
      });
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    try {
      if (provider === "google") {
        await loginWithGoogle();
      } else {
        await loginWithGitHub();
      }
    } catch (error) {
      toast.error(`Gagal login dengan ${provider}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            id="email"
            type="email"
            placeholder="dev@codebox.com"
            className={`pl-10 transition-all ${
              errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
            {...register("email")}
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 font-medium animate-pulse">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
          >
            Lupa Password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`pl-10 pr-10 transition-all ${
              errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
            {...register("password")}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
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
          <p className="text-xs text-red-500 font-medium animate-pulse">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/30 disabled:opacity-70 transition-all duration-300 hover:scale-[1.01] mt-3"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            Masuk ke Console
          </>
        )}
      </Button>

      {/* Separator */}
      <div className="relative flex items-center justify-center text-xs my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
          atau masuk dengan
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="">
        <Button
          variant="outline"
          type="button"
          onClick={() => handleOAuthLogin("google")}
          disabled={isSubmitting}
          className="w-full border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Chrome className="mr-2 h-4 w-4 text-red-500" /> Google
        </Button>
      </div>
    </form>
  );
};
