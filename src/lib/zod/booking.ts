import { z } from 'zod';

export const bookingSchema = z.object({
  serviceId: z.number().positive(),
  bookingDate: z.date(),
  method: z.enum(['AtFacility', 'SelfCollection', 'StaffVisit']),
  location: z.string().min(1, { message: 'Location is required' }),
  buyKit: z.boolean(),
  time: z.string().min(1, { message: 'Time is required' }),
});

// Conditional schema that requires location field when method is StaffVisit
export const bookingFormSchema = bookingSchema.refine(
  (data) => {
    // If method is StaffVisit, location must not be empty
    if (data.method === 'StaffVisit') {
      return data.location.trim().length > 0;
    }
    return true;
  },
  {
    message: 'Address is required for home visits',
    path: ['location'],
  },
);

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
