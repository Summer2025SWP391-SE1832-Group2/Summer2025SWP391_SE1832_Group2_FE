import { getTransaction } from '@/services/transaction';
import { useQuery } from '@tanstack/react-query';

export const useTransaction = (userId?: number) => {
  const queryTransactions = useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => getTransaction(userId!),
    enabled: !!userId,
  });

  return {
    queryTransactions,
  };
};
