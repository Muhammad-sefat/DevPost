import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email must not exceed 100 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must not exceed 32 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const googlesigninSchema = z.object({
  idToken: z.string().min(1, "Google ID Token is required"),
});

export const githubSigninSchema = z.object({
  code: z.string().min(1, "GitHub code is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type GooglesigninInput = z.infer<typeof googlesigninSchema>;
