import axiosInstance from "@/lib/api/axios";
import type { TestParameter } from "@/types/testparameters";

export const getTestParametersByBookingId = async (
  bookingId: number
): Promise<TestParameter[]> => {
  const res = await axiosInstance.get(`/api/TestParameter/${bookingId}/getByBooking`);
  return res.data;
};
export const getTestParametersByServiceId = async (
  bookingId: number
): Promise<TestParameter[]> => {
  const res = await axiosInstance.get(`/api/TestParameter/${bookingId}/getByService`);
  return res.data;
};

export const createTestParameter = async (data: TestParameter): Promise<TestParameter> => {
  const response = await axiosInstance.post<TestParameter>("/api/TestParameter", data);
  return response.data;
};

export const updateTestParameter = async (id: number, data: TestParameter): Promise<TestParameter> => {
  const response = await axiosInstance.put<TestParameter>(`/api/TestParameter`, {
    ...data,
  });
  return response.data;
};

export const deleteTestParameter = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/TestParameter/${id}`);
};
