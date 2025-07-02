import { Card, CardContent } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { BookingFormValues } from '@/lib/zod/booking';

interface ScheduleStepProps {
  form: UseFormReturn<BookingFormValues>;
  timeSlots: { id: number; label: string; value: string }[] | undefined;
  selectedMethod: string;
}

export function ScheduleStep({ form, timeSlots, selectedMethod }: ScheduleStepProps) {
  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl font-bold mb-2'>Thời gian & địa điểm</h2>
        <p className='text-muted-foreground'>Chọn thời gian và địa điểm phù hợp cho việc lấy mẫu</p>
      </div>

      <div className='max-w-2xl mx-auto space-y-6'>
        <Card>
          <CardContent className='pt-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='collectionDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='flex items-center gap-2'>
                      <CalendarIcon className='h-4 w-4' />
                      Ngày hẹn
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'h-12 pl-3 text-left font-normal',
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
                    <FormLabel className='flex items-center gap-2'>
                      <Clock className='h-4 w-4' />
                      Khung giờ
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='h-12'>
                          <SelectValue placeholder='Chọn khung giờ' />
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
          </CardContent>
        </Card>

        {(selectedMethod === 'NHAN_VIEN_DEN_NHA' || selectedMethod === 'TU_THU_MAU') && (
          <Card>
            <CardContent className='pt-6'>
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4' />
                      Địa chỉ
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập địa chỉ đầy đủ' className='h-12' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
