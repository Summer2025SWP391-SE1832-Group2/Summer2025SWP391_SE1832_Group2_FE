import axiosInstance from '@/lib/api/axios';
import type { WorkSchedule } from '@/types/work_schedule';

const getWorkSchedule = async () => {
  const response = await axiosInstance.get<WorkSchedule[]>('/api/WorkSchedule');
  return response.data;
};

export { getWorkSchedule };
