import { z } from 'zod';

// Form validation schema
const serviceFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên dịch vụ là bắt buộc')
    .max(100, 'Tên dịch vụ không được vượt quá 100 ký tự'),
  description: z
    .string()
    .min(1, 'Mô tả là bắt buộc')
    .max(500, 'Mô tả không được vượt quá 500 ký tự'),
  durationDays: z
    .number()
    .min(1, 'Thời gian xử lý ít nhất 1 ngày')
    .max(365, 'Thời gian xử lý không được vượt quá 365 ngày'),
  price: z.number().min(10000, 'Giá phải lớn hơn 10.000 VNĐ'),
  isAtHome: z.boolean(),
  isStaffSuport: z.boolean(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const serviceFormDefaultValues = {
  name: '',
  description: '',
  durationDays: 1,
  price: 10000,
  isAtHome: false,
  isStaffSuport: false,
};

export { serviceFormSchema, type ServiceFormValues, serviceFormDefaultValues };
