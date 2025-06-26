import axiosInstance from '@/lib/api/axios';
import type { Transaction } from '@/types/transaction';

const getTransaction = async (userId: number): Promise<Transaction[]> => {
  const response = await axiosInstance.get<Transaction[]>(`api/Transaction/${userId}/getByUserId`);
  return response.data;
};

export { getTransaction };
