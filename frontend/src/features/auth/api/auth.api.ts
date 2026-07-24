import api from "@/lib/axios";
import { User } from "@/store/slices/authSlice";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export const signUpApi = async (input: SignupInput): Promise<ApiResponse<{ user: User }>> => {
  const response = await api.post("/auth/signup", input);
  return response.data;
};

export const verifyEmailApi = async (input: VerifyEmailInput): Promise<ApiResponse> => {
  const response = await api.post("/auth/verify-email", input);
  return response.data;
};

export const signInApi = async (input: SigninInput): Promise<ApiResponse<{ user: User }>> => {
  const response = await api.post("/auth/signin", input);
  return response.data;
};

export const logoutApi = async (): Promise<ApiResponse> => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getMeApi = async (): Promise<ApiResponse<User>> => {
  const response = await api.get("/users/me");
  return response.data;
};

export const refreshTokenApi = async (): Promise<ApiResponse<{ user: User }>> => {
  const response = await api.post("/auth/refresh-token");
  return response.data;
};
