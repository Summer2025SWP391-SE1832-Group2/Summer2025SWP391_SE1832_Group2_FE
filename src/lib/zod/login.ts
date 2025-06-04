import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, 'Tên đăng nhập là bắt buộc')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(20, 'Tên đăng nhập không được quá 20 ký tự'),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự'),
});

export const loginFormDefaultValues = {
  username: '',
  password: '',
};

export type LoginFormValues = z.infer<typeof loginFormSchema>;
