"use client";

import { useState } from "react";
import {
  loginAction,
  registerAction,
  oAuthLoginAction,
  logoutAction,
  forgotPasswordAction,
  updatePasswordAction,
  resendVerificationAction,
} from "@/lib/actions/auth";
import { LoginInput, RegisterInput } from "@/lib/validations/auth";
import { toast } from "sonner";

export function useAuthActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wrapper Helper
  const handleAction = async (
    actionPromise: Promise<any>,
    errorMsg: string
  ) => {
    setIsSubmitting(true);
    try {
      const result = await actionPromise;
      if (!result.success) {
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: errorMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const login = (data: LoginInput) =>
    handleAction(loginAction(data), "Gagal login");
  const register = (data: RegisterInput) =>
    handleAction(registerAction(data), "Gagal daftar");
  const forgotPassword = (email: string) =>
    handleAction(forgotPasswordAction(email), "Gagal kirim email");
  const updatePassword = (pass: string) =>
    handleAction(updatePasswordAction(pass), "Gagal update password");
  const resendVerificationEmail = (email: string) =>
    handleAction(resendVerificationAction(email), "Gagal kirim ulang");

  const loginWithGoogle = async () => {
    setIsSubmitting(true);
    try {
      await oAuthLoginAction("google");
    } catch {
      setIsSubmitting(false);
      toast.error("Gagal koneksi Google");
    }
  };

  const loginWithGitHub = async () => {
    setIsSubmitting(true);
    try {
      await oAuthLoginAction("github");
    } catch {
      setIsSubmitting(false);
      toast.error("Gagal koneksi GitHub");
    }
  };

  const logout = async () => {
    await logoutAction();
  };

  return {
    isSubmitting,
    login,
    register,
    forgotPassword,
    updatePassword,
    resendVerificationEmail,
    logout,
    loginWithGoogle,
    loginWithGitHub,
  };
}
