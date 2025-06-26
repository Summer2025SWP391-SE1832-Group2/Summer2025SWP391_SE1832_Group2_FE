import {
  checkExistingNearBooking,
  createBooking,
  regeneratePaymentQR,
} from '@/services/booking_service';
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

  const regeneratePaymentQRMutation = useMutation({
    mutationFn: (bookingId: number) => regeneratePaymentQR(bookingId),
  });

  return {
    createBookingMutation,
    checkExistingNearBookingQuery,
    regeneratePaymentQRMutation,
  };
};
