import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must be less than 72 characters"),
});

// Register Schema
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(72, "Password must be less than 72 characters"),
    confirmPassword: z.string(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens"
      ),
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Profile Update Schema
export const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .optional(),
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .optional()
    .nullable(),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .nullable(),
  avatar_url: z
    .string()
    .url("Invalid URL format")
    .optional()
    .nullable()
    .or(z.literal("")),
  website: z
    .string()
    .url("Invalid URL format")
    .optional()
    .nullable()
    .or(z.literal("")),
  github_url: z
    .string()
    .url("Invalid GitHub URL")
    .regex(/^https?:\/\/(www\.)?github\.com\/.+$/, "Must be a valid GitHub URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  twitter_url: z
    .string()
    .url("Invalid Twitter URL")
    .regex(
      /^https?:\/\/(www\.)?(twitter|x)\.com\/.+$/,
      "Must be a valid Twitter/X URL"
    )
    .optional()
    .nullable()
    .or(z.literal("")),
  linkedin_url: z
    .string()
    .url("Invalid LinkedIn URL")
    .regex(
      /^https?:\/\/(www\.)?linkedin\.com\/.+$/,
      "Must be a valid LinkedIn URL"
    )
    .optional()
    .nullable()
    .or(z.literal("")),
});

// Change Password Schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(72, "New password must be less than 72 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
