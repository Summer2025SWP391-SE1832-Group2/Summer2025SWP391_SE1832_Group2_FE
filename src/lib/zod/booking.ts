import { z } from 'zod';

export const bookingSchema = z.object({
  serviceId: z.number().positive(),
  collectionDate: z.date(),
  method: z.enum(['TAI_CO_SO_Y_TE', 'TU_THU_MAU', 'NHAN_VIEN_DEN_NHA']),
  location: z.string().min(1, { message: 'Địa chỉ là bắt buộc' }),
  buyKit: z.boolean(),
  time: z.string().min(1, { message: 'Vui lòng chọn khung giờ' }),
});

export const bookingDefaultValues = {
  serviceId: 0,
  method: 'TAI_CO_SO_Y_TE' as BookingFormValues['method'],
  location: 'Cơ sở y tế',
  collectionDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  buyKit: false,
  time: '',
};

// Conditional schema that requires location field when method is StaffVisit
export const bookingFormSchema = bookingSchema.refine(
  (data) => {
    // If method is StaffVisit, location must not be empty
    if (data.method === 'NHAN_VIEN_DEN_NHA' || data.method === 'TU_THU_MAU') {
      return data.location.trim().length > 0;
    }
    return true;
  },
  {
    message: 'Địa chỉ là bắt buộc cho phương thức này',
    path: ['location'],
  },
);

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
