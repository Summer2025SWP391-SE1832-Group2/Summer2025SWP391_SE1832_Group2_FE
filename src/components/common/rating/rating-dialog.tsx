import { useAuthStore } from '@/stores/auth';
import { Loader2, Star } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useRating } from '@/hooks/useRating';
import { ratingFormDefaultValues, ratingFormSchema, type RatingFormValues } from '@/lib/zod/rating';
import type { Rating } from '@/types/rating';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface RatingDialogProps {
  bookingId: number;
  onRatingSuccess?: () => void;
  trigger?: React.ReactNode;
}

export const RatingDialog = ({ bookingId, onRatingSuccess, trigger }: RatingDialogProps) => {
  const { user } = useAuthStore();
  const { ratingMutation } = useRating();
  const [open, setOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: ratingFormDefaultValues,
  });

  const handleSubmit = async (values: RatingFormValues) => {
    if (!user?.userId) {
      return;
    }

    const ratingData: Rating = {
      ratingId: 0,
      content: values.content || '',
      vote: values.vote,
      bookingId,
      createBy: user.userId,
    };

    const result = await ratingMutation.mutateAsync(ratingData);
    if (result) {
      setOpen(false);
      onRatingSuccess?.();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline' className='gap-2'>
            <Star className='w-4 h-4' />
            Đánh giá dịch vụ
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-md'
        onInteractOutside={(e) => {
          if (ratingMutation.isPending) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Đánh giá dịch vụ</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='vote'
              render={({ field }) => (
                <FormItem>
                  <div className='flex justify-center'>
                    <div className='flex gap-1'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type='button'
                          onClick={() => field.onChange(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className='focus:outline-none transition-transform hover:scale-110'
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoveredRating || field.value)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <FormMessage className='text-center mt-2' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder='Chia sẻ trải nghiệm của bạn về dịch vụ...'
                      rows={4}
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-3'>
              <DialogClose asChild>
                <Button type='button' variant='outline'>
                  Hủy
                </Button>
              </DialogClose>
              <Button type='submit' disabled={ratingMutation.isPending}>
                {ratingMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi đánh giá'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
