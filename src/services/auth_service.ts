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

const resetPasswordService = async (email: string, newPassword: string, verifyCode?: string) => {
  let url = `/api/Auth/reset-password?email=${encodeURIComponent(
    email,
  )}&newPass=${encodeURIComponent(newPassword || '')}`;
  if (verifyCode) {
    url += `&VerifyCode=${encodeURIComponent(verifyCode)}`;
  }
  const response = await axiosInstance.put<String>(url);
  return response.data;
};

export { loginService, registerService, resetPasswordService };
