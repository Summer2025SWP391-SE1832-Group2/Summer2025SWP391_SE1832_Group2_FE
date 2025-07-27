import axiosInstance from '@/lib/api/axios';
import type { Transaction, TransactionChartData, TransactionSummary } from '@/types/transaction';

const getTransaction = async (userId: number): Promise<Transaction[]> => {
  const response = await axiosInstance.get<Transaction[]>(`api/Transaction/${userId}/getByUserId`);
  return response.data;
};

const totalAmount = async (): Promise<TransactionSummary> => {
  const response = await axiosInstance.get<TransactionSummary>(`api/Transaction/transactions/total-amount`);
  return response.data;
};
const getCurrentWeek = (): number => {
  const date = new Date();
  const startDate = new Date(date.getFullYear(), 0, 1); 
  const days = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 3600 * 24)); 
  return Math.ceil((days + startDate.getDay() + 1) / 7); 
};
const getCurrentMonth = (): number => {
  return new Date().getMonth() + 1; 
};
const chartData = async (type: string): Promise<TransactionChartData[]> => {
  let response;
  const year = new Date().getFullYear(); 
  if (type === "year") {
    response = await axiosInstance.get<TransactionChartData[]>(`api/Transaction/revenue-stats?year=${year}`);
  } else if (type === "week") {
    const currentWeek = getCurrentWeek();
    response = await axiosInstance.get<TransactionChartData[]>(`api/Transaction/revenue-stats?year=${year}&week=${currentWeek}`);
  } else if (type === "month") {
    const currentMonth = getCurrentMonth();
    response = await axiosInstance.get<TransactionChartData[]>(`api/Transaction/revenue-stats?year=${year}&month=${currentMonth}`);
  } else {
    throw new Error(`Invalid type: ${type}. Expected "year", "month", or "week".`);
  }

  return response.data;
};



export { getTransaction , totalAmount, chartData};
