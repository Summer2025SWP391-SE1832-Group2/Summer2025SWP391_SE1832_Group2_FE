import axiosInstance from '@/lib/api/axios';
import type { ResultDetail } from '@/types/resultdetail';



// GET result details by booking ID
export const getResultDetailsByBookingId = async (
  bookingId: number
): Promise<ResultDetail[]> => {
  const response = await axiosInstance.get<ResultDetail[]>(
    `/api/ResultDetail/byBookingId/${bookingId}`
  );
  return response.data;
};
