import { z } from 'zod';

// Base schema without refinement
const baseResetPasswordSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  newPassword: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự')
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
    ),
  confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  verifyCode: z.string().optional(), // Optional for the first step
});

// Add refinement for password matching
export const resetPasswordFormSchema = baseResetPasswordSchema.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  },
);

// Schema for the verification step with required verifyCode
export const resetPasswordVerifySchema = z
  .object({
    ...baseResetPasswordSchema.shape,
    verifyCode: z.string().min(1, 'Mã xác nhận là bắt buộc'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export const resetPasswordFormDefaultValues = {
  email: '',
  newPassword: '',
  confirmPassword: '',
  verifyCode: '',
};
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
