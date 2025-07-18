import { getRatingByBookingId, submitRating } from '@/services/rating_service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useRating = (bookingId?: number) => {
  const queryClient = useQueryClient();

  const ratingMutation = useMutation({
    mutationFn: submitRating,
    onSuccess: () => {
      toast.success('Đánh giá của bạn đã được gửi thành công');
      // Invalidate relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      if (bookingId) {
        queryClient.invalidateQueries({ queryKey: ['rating', bookingId] });
      }
    },
    onError: (error) => {
      console.error('Lỗi khi gửi đánh giá:', error);
      toast.error('Có lỗi xảy ra khi gửi đánh giá');
    },
  });

  const ratingQuery = useQuery({
    queryKey: ['rating', bookingId],
    queryFn: () => (bookingId ? getRatingByBookingId(bookingId) : null),
    enabled: !!bookingId,
  });

  return {
    ratingMutation,
    ratingQuery,
  };
};
