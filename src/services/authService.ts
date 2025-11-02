// src/services/authService.ts

import axios from "axios";
import type { AuthResponse, LoginPayload, LoginResponse, SignupPayload, VerifyEmailService } from "../types/authTypes";
import { postData } from "./services";

// Login function
// export const loginService = async (
// 	credentials: LoginPayload
// ): Promise<LoginResponse> => {
// 	return postData({
// 		endPoint: `/v1/auth/login`,
// 		data: credentials,
// 	});
// };
const AUTH_BASE = "/api/v1";
// Login function
export const loginService = async (credentials: LoginPayload): Promise<AuthResponse> => {
    return postData({
        endPoint: `${AUTH_BASE}/auth/login`,
        data: credentials,
    });
};

// Signup function
export const signupService = async ({
  username,
  email,
  password,
  bio,
}: SignupPayload): Promise<AuthResponse> => {
  const data = await postData({
    endPoint: `${AUTH_BASE}/auth/signup`,
    data: { username, email, password, bio },
  });
  return data;
};

export const verifyEmailService = async ({
  email,
  code,
}: VerifyEmailService): Promise<any> => {
  const data = await postData({
    endPoint: `${AUTH_BASE}/verify`,
    data: { email, code },
  });
  return data;
};

export const resendVerificationCode = async (email: string): Promise<any> => {
  const res = await axios.post(`${AUTH_BASE}/resend-verification`, { email });
  return res.data;
};