import axiosInstance from '@/lib/api/axios';
import type { LoginRequest, LoginResponse } from '@/types/login';
import type { RegisterRequest, RegisterResponse } from '@/types/register';

const loginService = async (data: LoginRequest) => {
  const response = await axiosInstance.post<LoginResponse>('/api/Auth/login', data);
  return response.data;
};

const registerService = async (data: RegisterRequest) => {
  let url = '/api/Auth/register';
  if (data.verificationCode) {
    url += `?VerifyCode=${data.verificationCode}`;
  }
  const response = await axiosInstance.post<RegisterResponse>(url, data);
  return response.data;
};

// First step: Request reset password (no verification code)
const requestResetPassword = async (data: { email: string; newPassword: string }) => {
  const { email, newPassword } = data;
  const url = `/api/Auth/reset-password?email=${encodeURIComponent(
    email,
  )}&newPass=${encodeURIComponent(newPassword)}`;
  const response = await axiosInstance.put<string>(url);
  return response.data;
};

// Second step: Confirm reset password with verification code
const confirmResetPassword = async (data: {
  email: string;
  newPassword: string;
  verifyCode: string;
}) => {
  const { email, newPassword, verifyCode } = data;
  const url = `/api/Auth/reset-password?email=${encodeURIComponent(
    email,
  )}&newPass=${encodeURIComponent(newPassword)}&VerifyCode=${encodeURIComponent(verifyCode)}`;
  const response = await axiosInstance.put<string>(url);
  return response.data;
};

export { loginService, registerService, requestResetPassword, confirmResetPassword };
