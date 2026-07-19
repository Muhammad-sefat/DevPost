import jwt, { type SignOptions } from "jsonwebtoken";
import { Role } from "@/constants/roles";
import { ENV } from "@/config/env";

export interface JwtPayload {
  userId: string;
  role: Role;
}

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, ENV.JWT_ACCESS_SECRET, { expiresIn: ENV.JWT_ACCESS_EXPIRES_IN } as SignOptions);

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN } as SignOptions);

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ENV.JWT_ACCESS_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, ENV.JWT_REFRESH_SECRET) as JwtPayload;
