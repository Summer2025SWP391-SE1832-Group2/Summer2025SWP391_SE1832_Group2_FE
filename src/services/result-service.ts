import axiosInstance from '@/lib/api/axios';
import type { ResultDetail } from '@/types/resultdetail';
import type { ResultItem } from '@/types/resultdetail';



// GET result details by booking ID
export const getResultDetailsByBookingId = async (
  bookingId: number
): Promise<ResultDetail[]> => {
  const response = await axiosInstance.get<ResultDetail[]>(
    `/api/ResultDetail/${bookingId}/getAllResultByBookingId`
  );
  return response.data;
};

export const createMultipleResultDetails = async (
  bookingId: number,
  results: ResultItem[]
): Promise<any> => {
  const payload = {
    bookingId,
    results,
  };
  const response = await axiosInstance.post("/api/ResultDetail/createMultipleResults", payload);
  return response.data;
};
