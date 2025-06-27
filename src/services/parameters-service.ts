import axiosInstance from "@/lib/api/axios";
import type { TestParameter } from "@/types/testparameters";

export const getTestParametersByBookingId = async (
  bookingId: number
): Promise<TestParameter[]> => {
  const res = await axiosInstance.get(`/api/TestParameter/${bookingId}/getByBooking`);
  return res.data;
};