import { createBooking } from '@/services/booking';
import { useMutation } from '@tanstack/react-query';

export const useBooking = () => {
  const createBookingMutation = useMutation({
    mutationFn: createBooking,
  });

  return {
    createBookingMutation,
  };
};
