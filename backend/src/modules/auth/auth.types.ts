import { Role } from "@prisma/client";

export interface SignupInput {
    name: string;
    email: string;
    password: string;
}
export interface VerifyEmailInput {
    email: string;
    otp: string;
};
export interface SigninInput {
    email: string;
    password: string;
};
export interface SignupResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: Role;
        avatarUrl: string | null;
        emailVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
}

export interface TokenPayload {
    userId: string;
    role: Role;
}

export interface ResendVerificationOtpInput {
    email: string;
}
export interface ForgotPasswordInput {
    email: string;
}
export interface ResendForgotPasswordOtpInput {
    email: string;
}
export interface VerifyForgotPasswordOtpInput {
    email: string;
    otp: string;
}
export interface ResetPasswordInput {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}