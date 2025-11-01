// src/services/authService.ts

import type { AuthResponse, LoginPayload, LoginResponse, SignupPayload } from "../types/authTypes";
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

// Login function
export const loginService = async (credentials: LoginPayload): Promise<LoginResponse> => {
    return postData({
        endPoint: `/api/v1/auth/login`,
        data: credentials,
    });
};

// Signup function
export const signupService = async (userData: SignupPayload): Promise<AuthResponse> => {
    return postData({
        endPoint: `/api/v1/auth/signup`,
        data: userData,
    });
};
