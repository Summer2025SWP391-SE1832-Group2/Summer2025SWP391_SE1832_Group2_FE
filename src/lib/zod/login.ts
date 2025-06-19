import { z } from 'zod';

const loginFormSchema = z.object({
  email: z.string().trim().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z
    .string()
    .trim()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự')
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
    ),
});

const loginFormDefaultValues = {
  username: '',
  password: '',
};

type LoginFormValues = z.infer<typeof loginFormSchema>;

export { loginFormSchema, loginFormDefaultValues, type LoginFormValues };
