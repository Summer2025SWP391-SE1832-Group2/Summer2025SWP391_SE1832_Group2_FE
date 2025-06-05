import { z } from 'zod';

const serviceTypeSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

type ServiceTypeFormValues = z.infer<typeof serviceTypeSchema>;

const ServiceDefaultValues = {
  name: '',
  description: '',
};

export { serviceTypeSchema, ServiceDefaultValues, type ServiceTypeFormValues };
