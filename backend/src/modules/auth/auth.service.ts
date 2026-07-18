import bcrypt from "bcryptjs";
import { prisma } from "@/config/db";
import { ApiError } from "@/lib/api-error";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { RegisterInput, LoginInput } from "./auth.validation";

// Business logic lives here — NOT in the controller. This keeps controllers
// as thin "translate HTTP <-> service" layers, which makes services reusable
// (e.g. called from a CLI script, a cron job, or an MCP tool later).
export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw ApiError.conflict("Email already in use");

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, password: hashedPassword },
    });

    return this.issueTokens(user.id, user.role);
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw ApiError.unauthorized("Invalid email or password");

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

    return this.issueTokens(user.id, user.role);
  },

  issueTokens(userId: string, role: "SUPER_ADMIN" | "ADMIN" | "USER") {
    const payload = { userId, role };
    return {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  },
};
