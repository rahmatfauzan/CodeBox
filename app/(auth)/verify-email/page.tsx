"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@/lib/hooks/use-auth-actions";
import { AuthCard } from "../components/auth-card";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const { resendVerificationEmail, isSubmitting } = useAuthActions();

  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!email) return;
    const result = await resendVerificationEmail(email);
    if (result.success) {
      toast.success("Email Terkirim");
      setCountdown(60);
    } else {
      toast.error("Gagal", { description: result.error });
    }
  };

  return (
    <AuthCard
      // 1. Header Gradient (Sesuai AuthCard bawaan, mirip referensi)
      title="Verify Your Email"
      subtitle="Check your inbox to continue"
      // 2. Matikan footer bawaan agar kita bisa custom tombol Back di dalam
      showFooter={false}
    >
      <div className="text-center">
        {/* Icon Surat dalam Lingkaran */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-indigo-600" />
          </div>
        </div>

        {/* Teks Utama */}
        <div className="mb-8 space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            Email Verification Sent! ✉️
          </h3>

          <div className="text-sm text-slate-600 dark:text-slate-400">
            We've sent a verification link to <br />
            <span className="font-semibold text-indigo-600 text-base">
              {email || "your email address"}
            </span>
          </div>

          <p className="text-xs text-slate-500 px-2">
            Click the link in the email to verify your account and start using
            CodeBox.
          </p>
        </div>

        {/* Kotak Checklist (Persis Gambar Referensi) */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 text-left mb-8 border border-slate-100 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Didn't receive the email?
          </p>
          <ul className="space-y-3">
            {[
              "Check your spam or junk folder",
              "Make sure the email address is correct",
              "Wait a few minutes for email delivery",
              "Click the button below to resend",
            ].map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tombol Action */}
        <div className="space-y-6">
          {/* Tombol Resend (Outline Style) */}
          <Button
            onClick={handleResend}
            disabled={isSubmitting || countdown > 0 || !email}
            variant="outline"
            className="w-full h-11 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" /> Resend Verification Email
              </>
            )}
          </Button>

          {/* Tombol Back to Login (Manual) */}
          <Link href="/login" className="block">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group cursor-pointer">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              Back to Login
            </div>
          </Link>
        </div>

        {/* Footer Link Support */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400">
            Still having issues?{" "}
            <Link
              href="#"
              className="text-indigo-600 hover:underline font-medium"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
