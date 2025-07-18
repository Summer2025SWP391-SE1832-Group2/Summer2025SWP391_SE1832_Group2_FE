import { z } from 'zod';

export const ratingFormSchema = z.object({
  vote: z.number().min(1, { message: 'Vui lòng chọn số sao đánh giá' }).max(5),
  content: z.string().optional(),
});

export type RatingFormValues = z.infer<typeof ratingFormSchema>;

export const ratingFormDefaultValues: RatingFormValues = {
  vote: 0,
  content: '',
};
