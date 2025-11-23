"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

// Import komponen kita
import { useAuthActions } from "@/lib/hooks/use-auth-actions";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth"; 
import { AuthCard } from "../components/auth-card";

export default function ForgotPasswordPage() {
  const { forgotPassword, isSubmitting } = useAuthActions();
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    // Panggil fungsi dari hook useAuthActions
    const result = await forgotPassword(data.email);

    if (result.success) {
      setSentToEmail(data.email);
      setEmailSent(true);
      toast.success("Email Terkirim");
    } else {
      toast.error("Gagal Mengirim", { description: result.error });
    }
  };

  // --- TAMPILAN SUKSES (JIKA EMAIL SUDAH DIKIRIM) ---
  if (emailSent) {
    return (
      <AuthCard
        title="Cek Inbox Anda"
        subtitle="Link reset password telah dikirim"
        showFooter={false}
      >
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="mx-auto w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center relative">
            <Mail className="h-10 w-10 text-indigo-600" />
            <div className="absolute top-0 right-0 bg-green-500 rounded-full p-1 border-2 border-white dark:border-slate-900 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Kami telah mengirim link reset ke:
              </p>
              <div className="font-medium text-lg text-indigo-600 break-all border p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border-indigo-100 dark:border-indigo-900/30">
                {sentToEmail}
              </div>
            </div>
            
            <p className="text-xs text-slate-500 px-4">
              Klik link di dalam email tersebut untuk membuat password baru. 
              Jika tidak masuk, cek folder <strong>Spam</strong> atau <strong>Promotions</strong>.
            </p>
          </div>

          <div className="pt-2">
             <Link href="/login">
                <Button variant="outline" className="w-full gap-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Login
                </Button>
             </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  // --- TAMPILAN FORM INPUT ---
  return (
    <AuthCard
      title="Lupa Password?"
      subtitle="Masukkan email Anda, kami akan kirimkan link reset."
      backButtonLabel="Kembali ke Login"
      backButtonHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email Terdaftar</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              className={`pl-10 transition-all ${errors.email ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-indigo-500"}`}
              {...register("email")}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/30 disabled:opacity-70 transition-all duration-300 hover:scale-[1.01]"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengirim Link...
            </>
          ) : (
            "Kirim Link Reset"
          )}
        </Button>
      </form>
    </AuthCard>
  );
}