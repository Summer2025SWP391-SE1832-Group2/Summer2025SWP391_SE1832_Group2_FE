import { z } from 'zod';

// Sample schema
const sampleSchema = z.object({
  sampleType: z.string().min(1, { message: 'Vui lòng chọn loại mẫu' }),
  participantName: z.string().min(1, { message: 'Vui lòng điền tên người tham gia' }),
  notes: z.string().min(1, { message: 'Vui lòng điền ghi chú' }),
});

// Base booking schema without samples validation
const baseBookingSchema = z.object({
  serviceId: z.number().positive(),
  collectionDate: z.date(),
  method: z.enum(['TAI_CO_SO_Y_TE', 'TU_THU_MAU', 'NHAN_VIEN_DEN_NHA']),
  location: z.string().min(1, { message: 'Địa chỉ là bắt buộc' }),
  buyKit: z.boolean(),
  time: z.string().min(1, { message: 'Vui lòng chọn khung giờ' }),
});

// Flexible samples schema that accepts either one or two samples
export const bookingSchema = baseBookingSchema
  .extend({
    samples: z.array(sampleSchema).min(1, { message: 'Vui lòng điền thông tin ít nhất 1 mẫu' }),
  })
  .refine(
    (data) => {
      // For NIPT service (serviceId = 7), one sample is enough
      // For other services, we need exactly 2 samples
      if (data.serviceId === 7) {
        return data.samples.length >= 1;
      }
      return data.samples.length === 2;
    },
    {
      message: 'Vui lòng điền đầy đủ thông tin của 2 mẫu',
      path: ['samples'],
    },
  );

export const bookingDefaultValues = {
  serviceId: 0,
  method: 'TAI_CO_SO_Y_TE' as BookingFormValues['method'],
  location: '123 Nguyễn Thị Minh Khai, Q.1, TP.HCM',
  collectionDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  buyKit: false,
  time: '',
  samples: [
    {
      sampleType: '',
      participantName: '',
      notes: '',
    },
    {
      sampleType: '',
      participantName: '',
      notes: '',
    },
  ],
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
