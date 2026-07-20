import { SigninInput, SignupInput, SignupResponse, VerifyEmailInput } from "./auth.types";
import { ApiError } from "@/utils/api-error";
import { prisma } from "@/config/db";
import { comparePassword, hashPassword } from "@/utils/password";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";
import { generateOTP } from "@/utils/otp";
import { sendEmail } from "@/utils/mail";
import { emailVerificationTemplate } from "@/templates/email-verification";

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


export const authService = { signup, verifyEmail, signin }