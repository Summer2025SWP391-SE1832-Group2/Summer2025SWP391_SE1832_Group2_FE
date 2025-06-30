import axiosInstance from "@/lib/api/axios";
import type { UserWorkSchedule, scheduleUser } from "@/types/userworkschedule";

const getAllUserWorkSchedules = async (): Promise<UserWorkSchedule[]> => {
    const response = await axiosInstance.get<UserWorkSchedule[]>("/api/UserWorkSchedule");
    return response.data;
  };
  
  // [GET] /api/UserWorkSchedule/{id}
  const getUserWorkScheduleById = async (id: number): Promise<UserWorkSchedule> => {
    const response = await axiosInstance.get<UserWorkSchedule>(`/api/UserWorkSchedule/${id}`);
    return response.data;
  };
  
  // [POST] /api/UserWorkSchedule
  const createUserWorkSchedule = async (
    data: Omit<UserWorkSchedule, "userWorkScheduleId">
  ): Promise<UserWorkSchedule> => {
    const response = await axiosInstance.post<UserWorkSchedule>("/api/UserWorkSchedule", data);
    console.log("createUserWorkSchedule response:", response.data);
    return response.data;
  };
  
  // [PUT] /api/UserWorkSchedule/{id}
  const updateUserWorkSchedule = async (
    id: number,
    data: Partial<UserWorkSchedule>
  ): Promise<UserWorkSchedule> => {
    const response = await axiosInstance.put<UserWorkSchedule>(`/api/UserWorkSchedule/${id}`, data);
    return response.data;
  };
  
  // [DELETE] /api/UserWorkSchedule/{id}
  const deleteUserWorkSchedule = async (id: number): Promise<void> => {
    console.log("deleteUserWorkSchedule called with id:", id);
    await axiosInstance.delete(`/api/UserWorkSchedule/${id}`);
  };

  const getUserWorkScheduleUserById = async (id: number): Promise<scheduleUser[]> => {
    const response = await axiosInstance.get<scheduleUser[]>(`/api/UserWorkSchedule/getUser_workScheduleByUserID?id=${id}`);
    return response.data;
  };

export {
    getAllUserWorkSchedules,
    getUserWorkScheduleById,
    createUserWorkSchedule,
    updateUserWorkSchedule,
    deleteUserWorkSchedule,
    getUserWorkScheduleUserById
};
