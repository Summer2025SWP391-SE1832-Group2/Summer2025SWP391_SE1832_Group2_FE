import axiosInstance from "@/lib/api/axios";
import type { User } from "@/types/user";
import type { WorkSchedule } from "@/types/workschedule";

const getAllWorkSchedules = async (): Promise<WorkSchedule[]> => {
    const response = await axiosInstance.get<WorkSchedule[]>("/api/WorkSchedule");
    return response.data;
  };
  
  // [GET] /api/WorkSchedule/{id}
  const getWorkScheduleById = async (id: number): Promise<WorkSchedule> => {
    const response = await axiosInstance.get<WorkSchedule>(`/api/WorkSchedule/${id}`);
    return response.data;
  };
  
  // [POST] /api/WorkSchedule
  const createWorkSchedule = async (data: Omit<WorkSchedule, "id">): Promise<WorkSchedule> => {
    const response = await axiosInstance.post<WorkSchedule>("/api/WorkSchedule", data);
    return response.data;
  };
  
  // [PUT] /api/WorkSchedule/{id}
  const updateWorkSchedule = async (id: number, data: Partial<WorkSchedule>): Promise<WorkSchedule> => {
    const response = await axiosInstance.put<WorkSchedule>(`/api/WorkSchedule/${id}`, data);
    return response.data;
  };
  
  // [DELETE] /api/WorkSchedule/{id}
  const deleteWorkSchedule = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/WorkSchedule/${id}`);
  };
  const getUser_workScheduleBySlot = async (id: number, date : string): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>(`/api/UserWorkSchedule/getUser_workScheduleBySlot?workScheduleId=${id}&date=${date}`);
    return response.data;
  };
export {
    getAllWorkSchedules,
    getWorkScheduleById,
    createWorkSchedule,
    updateWorkSchedule,
    deleteWorkSchedule,
    getUser_workScheduleBySlot
};
