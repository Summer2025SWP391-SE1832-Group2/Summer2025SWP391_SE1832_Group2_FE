import axiosInstance from '@/lib/api/axios';
import type { TestParameter } from '@/types/testparameters';


// GET test parameters by service ID
export const getTestParametersByServiceId = async (serviceId: number): Promise<TestParameter[]> => {
  const response = await axiosInstance.get<TestParameter[]>(
    `/api/TestParameter/${serviceId}/getByService`
  );
  return response.data;
};
