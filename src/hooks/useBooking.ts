import { checkExistingNearBooking, createBooking } from '@/services/booking';
import { useAuthStore } from '@/stores/auth';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useBooking = () => {
  const { user } = useAuthStore();
  const userId = user?.userId;
  const createBookingMutation = useMutation({
    mutationFn: createBooking,
  });

  const checkExistingNearBookingQuery = useQuery({
    queryKey: ['checkExistingNearBooking'],
    queryFn: () => checkExistingNearBooking(userId ?? 0),
    enabled: !!userId,
  });

  return {
    createBookingMutation,
    checkExistingNearBookingQuery,
  };
};
