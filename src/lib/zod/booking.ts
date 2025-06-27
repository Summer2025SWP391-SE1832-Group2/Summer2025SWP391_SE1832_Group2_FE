import { z } from 'zod';

// Time Slot Configuration
export const TIME_SLOTS = [
  { id: 'slot1', label: 'Slot 1 (7:30 - 9:00)', value: '7:30:00-9:00:00' },
  { id: 'slot2', label: 'Slot 2 (9:00 - 10:30)', value: '9:00:00-10:30:00' },
  { id: 'slot3', label: 'Slot 3 (13:00 - 14:30)', value: '13:00:00-14:30:00' },
  { id: 'slot4', label: 'Slot 4 (14:30 - 16:00)', value: '14:30:00-16:00:00' },
] as const;

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
  buyKit: false,
  time: TIME_SLOTS[0].value,
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
