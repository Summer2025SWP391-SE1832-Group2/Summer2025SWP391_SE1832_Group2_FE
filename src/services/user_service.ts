import axiosInstance from '@/lib/api/axios';
import { useAuthStore } from '@/stores/auth';
import type { UserRequest, UserResponse } from '@/types/user';

// GET all UserRequests
export const getAllUserRequests = async (): Promise<UserRequest[]> => {
  const response = await axiosInstance.get<UserRequest[]>('/api/User');
  return response.data;
};

// GET current logged-in UserRequest by ID
export const getUserRequestById = async (): Promise<UserRequest> => {
  const { user } = useAuthStore.getState();
  const userId = user?.userId;

  if (!userId) {
    throw new Error('Chưa login hoặc thiếu userId');
  }

  const response = await axiosInstance.get<UserRequest>(`/api/User/${userId}`);
  return response.data;
};

// CREATE UserRequest
export const createUserRequest = async (
  data: UserRequest & { password: string }
): Promise<UserResponse> => {
  const response = await axiosInstance.post<UserResponse>('/api/User', data);
  return response.data;
};

// UPDATE UserRequest
export const updateUserRequest = async (
  data: Partial<UserRequest> & { userRequestId: string }
): Promise<UserResponse> => {
  const response = await axiosInstance.put<UserResponse>('/api/User', {
    ...data,
    userRequestId: data.userRequestId,
  });
  return response.data;
};

// DELETE UserRequest by ID
export const deleteUserRequestById = async (id: string): Promise<UserResponse> => {
  const response = await axiosInstance.delete<UserResponse>(`/api/User/${id}`);
  return response.data;
};
