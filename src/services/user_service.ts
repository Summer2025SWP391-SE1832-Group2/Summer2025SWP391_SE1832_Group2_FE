import axiosInstance from '@/lib/api/axios';
import type { User } from '@/types/user';

// GET all UserRequests
export const getAllUserRequests = async (): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>('/api/User');
  return response.data;
};

// GET current logged-in UserRequest by ID
export const getUserRequestById = async (userId: number): Promise<User> => {
  if (!userId) {
    throw new Error('Chưa login hoặc thiếu userId');
  }
  const response = await axiosInstance.get<User>(`/api/User/${userId}`);
  return response.data;
};

// CREATE UserRequest
export const createUserRequest = async (data: User & { password: string }): Promise<boolean> => {
  const response = await axiosInstance.post<boolean>('/api/User', data);
  return response.data;
};

// UPDATE UserRequest
export const updateUserRequest = async (data: User): Promise<boolean> => {
  const response = await axiosInstance.put<boolean>('/api/User', data);
  return response.data;
};

// DELETE UserRequest by ID
export const deleteUserRequestById = async (id: string): Promise<boolean> => {
  const response = await axiosInstance.delete<boolean>(`/api/User/${id}`);
  return response.data;
};
