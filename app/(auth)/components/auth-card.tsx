"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Code2 } from "lucide-react";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  showFooter?: boolean;
}

export const AuthCard = ({
  children,
  title,
  subtitle,
  backButtonLabel,
  backButtonHref,
  showFooter = true,
}: AuthCardProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-2xl overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0">
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white p-8 space-y-2 relative overflow-hidden">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            <h2 className="text-2xl font-bold relative z-10">{title}</h2>
            <p className="text-indigo-100 text-sm relative z-10 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          <div className="p-4">{children}</div>

          {/* Footer */}
          {showFooter && backButtonLabel && backButtonHref && (
            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-950/50 text-center text-sm border-t border-slate-100 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400">
                {backButtonHref === "/login"
                  ? "Sudah punya akun? "
                  : "Belum punya akun? "}
                <Link
                  href={backButtonHref}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                  {backButtonLabel}
                </Link>
              </p>
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8">
          © {new Date().getFullYear()} CodeBox. Built for Developers.
        </p>
      </motion.div>
    </>
  );
};
