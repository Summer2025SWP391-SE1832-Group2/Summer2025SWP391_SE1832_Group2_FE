// src/lib/zod/profile.ts
import { z } from 'zod';

export const profileFormSchema = z.object({
  fullName: z.string().min(1, 'Họ và tên không được để trống.'),
  phone: z.string().optional().nullable().transform(e => e === '' ? null : e), // Optional, can be null, convert empty string to null
  gender: z.union([
    z.literal('male'),
    z.literal('female'),
    z.literal('other'),
    z.literal(''), // Allow empty string for "Chọn giới tính" placeholder
    z.null(), // Allow null
  ]).optional().nullable(), // Optional, can be null or empty string

  // dateOfBirth will be an ISO string if selected, or null
  dateOfBirth: z.string().optional().nullable().transform(e => e === '' ? null : e),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const profileFormDefaultValues: ProfileFormValues = {
  fullName: '',
  phone: null,
  gender: null, // Initialize with null to match the type system
  dateOfBirth: null,
};