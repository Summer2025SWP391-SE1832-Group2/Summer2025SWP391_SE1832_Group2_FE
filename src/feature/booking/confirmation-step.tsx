import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, FileText, TestTube } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { BookingFormValues } from '@/lib/zod/booking';
import type { ServiceResponse } from '@/types/services';

interface ConfirmationStepProps {
  form: UseFormReturn<BookingFormValues>;
  service: ServiceResponse;
  samples: { participantName: string; sampleType: string; notes: string }[];
  selectedMethod: string;
}

export function ConfirmationStep({
  form,
  service,
  samples,
  selectedMethod,
}: ConfirmationStepProps) {
  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl font-bold mb-2'>Xác nhận thông tin</h2>
        <p className='text-muted-foreground'>Vui lòng kiểm tra lại thông tin trước khi đặt lịch</p>
      </div>

      <div className='max-w-2xl mx-auto space-y-6'>
        {/* Service Summary */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Thông tin dịch vụ
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Dịch vụ:</span>
              <span className='font-medium'>{service.name}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Phương thức:</span>
              <span className='font-medium'>
                {selectedMethod === 'TAI_CO_SO_Y_TE' && 'Tại cơ sở y tế'}
                {selectedMethod === 'TU_THU_MAU' && 'Tự thu mẫu'}
                {selectedMethod === 'NHAN_VIEN_DEN_NHA' && 'Nhân viên đến nhà'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Thời gian xử lý:</span>
              <span className='font-medium'>{service.durationDays} ngày</span>
            </div>
          </CardContent>
        </Card>

        {/* Sample Summary */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TestTube className='h-5 w-5' />
              Thông tin mẫu
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {samples.map((sample, index) => (
              <div key={index} className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
                <h4 className='font-medium mb-2'>Mẫu {index + 1}</h4>
                <div className='space-y-1 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Người tham gia:</span>
                    <span>{sample.participantName}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Loại mẫu:</span>
                    <span>{sample.sampleType}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Mối quan hệ:</span>
                    <span>{sample.notes}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Schedule Summary */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CalendarIcon className='h-5 w-5' />
              Lịch hẹn
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Ngày:</span>
              <span className='font-medium'>
                {format(form.getValues('collectionDate'), 'PPP', { locale: vi })}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Giờ:</span>
              <span className='font-medium'>{form.getValues('time')}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Địa điểm:</span>
              <span className='font-medium'>{form.getValues('location')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card className='border-primary'>
          <CardContent className='pt-6'>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Giá dịch vụ:</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(service.price)}
                </span>
              </div>
              <Separator />
              <div className='flex justify-between font-bold text-lg'>
                <span>Tổng cộng:</span>
                <span className='text-primary'>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(service.price)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
