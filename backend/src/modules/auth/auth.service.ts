import { ForgotPasswordInput, ResendForgotPasswordOtpInput, ResendVerificationOtpInput, ResetPasswordInput, SigninInput, SignupInput, SignupResponse, VerifyEmailInput, VerifyForgotPasswordOtpInput } from "./auth.types";
import { ApiError } from "@/utils/api-error";
import { prisma } from "@/config/db";
import { comparePassword, hashPassword } from "@/utils/password";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/utils/jwt";
import { generateOTP } from "@/utils/otp";
import { sendEmail } from "@/utils/mail";
import { emailVerificationTemplate } from "@/templates/email-verification";
import { forgotPasswordTemplate } from "@/templates/forgot-password";
import { ENV } from "@/config/env";
import { googleClient } from "@/utils/google";
import { Role, Provider } from "@prisma/client";
import axios from "axios";

const signup = async (payload: SignupInput): Promise<SignupResponse> => {

  const { name, email, password } = payload;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      emailVerified: true,
    },
  });

  // Generate OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 4 * 60 * 1000);
  await prisma.emailVerificationToken.create({
    data: {
      otp,
      userId: user.id,
      expiresAt,
    },
  });

  await sendEmail(
    user.email,
    "Verify your email",
    emailVerificationTemplate(user.name, otp)
  );
  // Generate tokens
  const tokenPayload = {
    userId: user.id,
    role: user.role,
  };


  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user,
    accessToken,
    refreshToken,
  };

}
const verifyEmail = async (payload: VerifyEmailInput) => {
  const { email, otp } = payload;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Already verified
  if (user.emailVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  // Find latest unused OTP
  const verificationToken =
    await prisma.emailVerificationToken.findFirst({
      where: {
        userId: user.id,
        usedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  if (!verificationToken) {
    throw new ApiError(400, "Verification OTP not found");
  }

  // Expired?
  if (verificationToken.expiresAt < new Date()) {
    throw new ApiError(400, "OTP has expired");
  }

  // Wrong OTP
  if (verificationToken.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // Verify user
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    }),
    prisma.emailVerificationToken.update({
      where: { id: verificationToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return null;
};

const signin = async (payload: SigninInput): Promise<SignupResponse> => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.password) {
    throw new ApiError(400, "Password not found");
  }

  const isPasswordMatched = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(400, "Invalid email or password");
  }

  if (!user.emailVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  const tokenPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);

  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
    },
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  let payload: {
    userId: string;
    role: Role;
  };

  try {
    payload = verifyRefreshToken(refreshToken) as {
      userId: string;
      role: Role;
    };
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    accessToken,
  };
};
const googleSignin = async (idToken: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: ENV.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new ApiError(401, "Invalid Google token");
  }

  const {
    email,
    name,
    picture,
    email_verified,
  } = payload;

  if (!email) {
    throw new ApiError(400, "Google account has no email");
  }

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: name ?? "",
        email,
        avatarUrl: picture,
        emailVerified: email_verified ?? true,
        provider: Provider.GOOGLE,
      },
    });
  }

  const tokenPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);

  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const githubSignin = async (code: string) => {
  // Exchange code for access token
  const tokenResponse = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: ENV.GITHUB_CLIENT_ID,
      client_secret: ENV.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const accessToken = tokenResponse.data.access_token;

  if (!accessToken) {
    throw new ApiError(401, "GitHub authentication failed");
  }

  // Get GitHub profile
  const userResponse = await axios.get(
    "https://api.github.com/user",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // Get user's email
  const emailResponse = await axios.get(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const primaryEmail = emailResponse.data.find(
    (email: any) => email.primary
  );

  if (!primaryEmail) {
    throw new ApiError(400, "GitHub email not found");
  }

  let user = await prisma.user.findUnique({
    where: {
      email: primaryEmail.email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: userResponse.data.name || userResponse.data.login,
        email: primaryEmail.email,
        avatarUrl: userResponse.data.avatar_url,
        provider: Provider.GITHUB,
        emailVerified: primaryEmail.verified,
      },
    });
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  return {
    user,
    accessToken: generateAccessToken(jwtPayload),
    refreshToken: generateRefreshToken(jwtPayload),
  };
};

const resendVerificationOtp = async (payload: ResendVerificationOtpInput) => {
  const { email } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.emailVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 4 * 60 * 1000);

  await prisma.emailVerificationToken.create({
    data: {
      otp,
      userId: user.id,
      expiresAt,
    },
  });

  await sendEmail(
    user.email,
    "Verify your email",
    emailVerificationTemplate(user.name, otp)
  );

  return null;
};

const forgotPassword = async (payload: ForgotPasswordInput) => {
  const { email } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 4 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      token: otp,
      userId: user.id,
      expiresAt,
    },
  });

  await sendEmail(
    user.email,
    "Reset your password",
    forgotPasswordTemplate(user.name, otp)
  );

  return null;
};

const resendForgotPasswordOtp = async (payload: ResendForgotPasswordOtpInput) => {
  const { email } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 4 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      token: otp,
      userId: user.id,
      expiresAt,
    },
  });

  await sendEmail(
    user.email,
    "Reset your password",
    forgotPasswordTemplate(user.name, otp)
  );

  return null;
};

const verifyForgotPasswordOtp = async (payload: VerifyForgotPasswordOtpInput) => {
  const { email, otp } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      usedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!resetToken) {
    throw new ApiError(400, "Password reset OTP not found");
  }

  if (resetToken.expiresAt < new Date()) {
    throw new ApiError(400, "OTP has expired");
  }

  if (resetToken.token !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  return null;
};

const resetPassword = async (payload: ResetPasswordInput) => {
  const { email, otp, newPassword } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      usedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!resetToken) {
    throw new ApiError(400, "Password reset OTP not found");
  }

  if (resetToken.expiresAt < new Date()) {
    throw new ApiError(400, "OTP has expired");
  }

  if (resetToken.token !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return null;
};

export const authService = {
  signup,
  verifyEmail,
  resendVerificationOtp,
  signin,
  refreshToken,
  googleSignin,
  githubSignin,
  forgotPassword,
  resendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
};