"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@/lib/hooks/use-auth-actions";
import { AuthCard } from "../components/auth-card";

// Schema Validasi Lokal
// Kita buat di sini saja karena spesifik untuk halaman ini
const updatePasswordSchema = z
  .object({
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { updatePassword, isSubmitting } = useAuthActions(); // Pastikan fungsi ini ada di hook Anda
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (data: UpdatePasswordInput) => {
    // Panggil server action via hook
    const result = await updatePassword(data.password);

    if (result.success) {
      toast.success("Password Berhasil Diubah", {
        description: "Anda dapat menggunakan password baru untuk login.",
        duration: 5000,
      });
      router.push("/login");
    } else {
      toast.error("Gagal Mengubah Password", {
        description:
          result.error || "Link verifikasi mungkin sudah kadaluarsa.",
      });
    }
  };

  return (
    <AuthCard
      title="Buat Password Baru"
      subtitle="Amankan akun Anda dengan kombinasi password yang kuat."
      showFooter={false} // Kita tidak butuh link login/register di footer
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input Password Baru */}
        <div className="space-y-2">
          <Label htmlFor="password">Password Baru</Label>
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
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Input Konfirmasi Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <div className="relative group">
            <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
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
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Tombol Simpan */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.01]"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Simpan Password Baru"
            )}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
