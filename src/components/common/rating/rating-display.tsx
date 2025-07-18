import { Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useRating } from '@/hooks/useRating';

interface RatingDisplayProps {
  bookingId: number;
}

export const RatingDisplay = ({ bookingId }: RatingDisplayProps) => {
  const { ratingQuery } = useRating(bookingId);

  // If loading, show a button with loading state
  if (ratingQuery.isLoading) {
    return (
      <Button variant='ghost' className='gap-2 cursor-default' disabled>
        <Skeleton className='h-4 w-4 rounded-full' />
        <Skeleton className='h-4 w-20' />
      </Button>
    );
  }

  // If error or no data, show a generic "Đã đánh giá" button
  if (ratingQuery.isError || !ratingQuery.data) {
    return (
      <Button variant='ghost' className='gap-2 cursor-default' disabled>
        <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
        Đã đánh giá
      </Button>
    );
  }
  const rating = ratingQuery.data[0];

  // If we have rating data, show a button that opens a dialog with the rating details

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' className='gap-2 hover:bg-gray-100'>
          <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
          Đã đánh giá ({rating.vote}/5)
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Chi tiết đánh giá</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex justify-center'>
            <div className='flex gap-1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= rating.vote ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {rating.content && (
            <div className='bg-gray-50 p-4 rounded-md'>
              <p className='text-gray-700'>{rating.content}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
