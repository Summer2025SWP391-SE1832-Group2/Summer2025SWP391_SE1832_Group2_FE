import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { BookingFormValues } from '@/lib/zod/booking';
import { vi } from 'date-fns/locale';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { SERVICE_METHODS } from './booking-service-methods';

type TimeSlot = {
  id: number;
  label: string;
  value: string;
};

type BookingFormFieldsProps = {
  form: UseFormReturn<BookingFormValues>;
  timeSlots: TimeSlot[] | undefined;
  selectedMethod: string;
};

export const needsAddress = (method: string) => {
  return method === SERVICE_METHODS.SELF_COLLECTION || method === SERVICE_METHODS.STAFF_VISIT;
};

export const BookingDateTimePicker = ({
  form,
  timeSlots,
}: Pick<BookingFormFieldsProps, 'form' | 'timeSlots'>) => (
  <div className='flex items-center gap-4'>
    <FormField
      control={form.control}
      name='collectionDate'
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <FormLabel>Ngày hẹn</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value ? (
                    format(field.value, 'PPP', { locale: vi })
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date()}
                captionLayout='dropdown'
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name='time'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Khung giờ</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Chọn khung giờ phù hợp' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {timeSlots?.map((slot) => (
                <SelectItem key={slot.id} value={slot.value} className='cursor-pointer'>
                  <span>{slot.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export const BookingAddressField = ({ form }: Pick<BookingFormFieldsProps, 'form'>) => (
  <FormField
    control={form.control}
    name='location'
    render={({ field }) => (
      <FormItem>
        <FormLabel>Địa chỉ</FormLabel>
        <FormControl>
          <Input placeholder='Nhập địa chỉ của bạn' {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
