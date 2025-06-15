import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { BookingFormValues } from '@/lib/zod/booking';
import type { UseFormReturn } from 'react-hook-form';

type ServiceMethodOptionProps = {
  method: BookingFormValues['method'];
  icon: React.ReactNode;
  title: string;
  description: string;
  form: UseFormReturn<BookingFormValues>;
  selectedMethod: string;
};

// Service method option component
const ServiceMethodOption = ({
  method,
  icon,
  title,
  description,
  form,
  selectedMethod,
}: ServiceMethodOptionProps) => (
  <Card
    className={cn(
      'cursor-pointer transition-all duration-300 hover:shadow-lg border-2',
      selectedMethod === method
        ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md'
        : 'border-transparent hover:border-primary/30',
    )}
    onClick={() => form.setValue('method', method)}
  >
    <CardContent className='p-4 flex items-start gap-4'>
      <div className='bg-primary/10 p-3 rounded-full flex-shrink-0'>{icon}</div>
      <div>
        <h3 className='font-medium text-lg mb-1'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
    </CardContent>
  </Card>
);

export default ServiceMethodOption;
