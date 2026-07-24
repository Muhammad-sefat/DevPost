"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setCredentials,
  setUser,
  setLoading,
  setError,
  logout as logoutAction,
  User,
} from "@/store/slices/authSlice";
import {
  signInApi,
  signUpApi,
  verifyEmailApi,
  logoutApi,
  getMeApi,
  SigninInput,
  SignupInput,
  VerifyEmailInput,
} from "@/features/auth/api/auth.api";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const login = async (input: SigninInput) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await signInApi(input);
      if (response.data?.user) {
        dispatch(setCredentials({ user: response.data.user }));
        toast.success(response.message || "Signed in successfully!");
        return response.data.user;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to sign in";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (input: SignupInput) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await signUpApi(input);
      if (response.data?.user) {
        dispatch(setCredentials({ user: response.data.user }));
        toast.success(response.message || "Account created successfully!");
        return response.data.user;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create account";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const verifyEmail = async (input: VerifyEmailInput) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await verifyEmailApi(input);
      toast.success(response.message || "Email verified successfully!");
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to verify email";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      // ignore server logout errors
    } finally {
      dispatch(logoutAction());
      toast.success("Logged out successfully");
      router.push("/signin");
    }
  };

  const fetchCurrentUser = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await getMeApi();
      if (response.data) {
        dispatch(setUser(response.data));
      } else {
        dispatch(setUser(null));
      }
    } catch (err) {
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    verifyEmail,
    logout,
    fetchCurrentUser,
  };
}
