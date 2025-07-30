import axiosInstance from '@/lib/api/axios';
import type { DashboardInfo, User, UserRole } from '@/types/user';

// GET all UserRequests
export const getAllUserRequests = async (): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>('/api/User');
  return response.data;
};

// GET filtered users by role ID
export const getFilteredUsers = async ({ roleId }: { roleId: number }): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>(`/api/User/GetUsersFilteredAsync/${roleId}`);
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

// UPDATE user role
export const updateUserRole = async (userId: number, newRole: UserRole): Promise<boolean> => {
  const response = await axiosInstance.put<boolean>(
    `/api/User/role?uid=${userId}&newRole=${newRole}`,
  );
  return response.data;
};
//Dashboard 
export const getDashboardInfo = async (): Promise<DashboardInfo> => {
  const response = await axiosInstance.get<DashboardInfo>('/api/User/get-dashboard-info');
  return response.data;
};
