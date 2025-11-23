import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(72, "Password maksimal 72 karakter"),
});

// Register Schema
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(30, "Username maksimal 30 karakter")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username hanya boleh mengandung huruf, angka, underscore, dan dash"
      ),
    full_name: z
      .string()
      .min(2, "Nama lengkap minimal 2 karakter")
      .max(100, "Nama lengkap maksimal 100 karakter")
      .optional(),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(72, "Password maksimal 72 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
});

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(72, "Password maksimal 72 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
