import { z } from 'zod';

// Base schema without refinement
const baseRegisterSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ và tên là bắt buộc')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ và tên không được quá 50 ký tự')
    .trim(),
  email: z.string().trim().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Số điện thoại là bắt buộc')
    .regex(
      /^(0|\+84)[3-9][0-9]{8}$/,
      'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)',
    ),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự')
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
    ),
  confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  verificationCode: z.string().optional(), // Optional for the first step
});

// Add refinement for password matching
export const registerFormSchema = baseRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  },
);

// Schema for the verification step with required verificationCode
export const registerVerifySchema = z
  .object({
    ...baseRegisterSchema.shape,
    verificationCode: z
      .string()
      .min(1, 'Mã xác minh là bắt buộc')
      .length(6, 'Mã xác minh phải có 6 số'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export const registerFormDefaultValues = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  verificationCode: '',
};

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
