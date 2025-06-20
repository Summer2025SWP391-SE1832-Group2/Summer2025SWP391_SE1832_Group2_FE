import { z } from 'zod';

export const profileFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Họ và tên không được để trống.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Số điện thoại là bắt buộc')
    .regex(
      /^(0|\+84)[3-9][0-9]{8}$/,
      'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)',
    ),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.date(),
  identityNumber: z.string().trim().min(1, 'Số CMND/CCCD là bắt buộc'),
  address: z.string().trim().min(1, 'Địa chỉ là bắt buộc'),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const profileFormDefaultValues: ProfileFormValues = {
  fullName: '',
  phone: '',
  gender: 'female',
  dateOfBirth: new Date(),
  identityNumber: '',
  address: '',
};
