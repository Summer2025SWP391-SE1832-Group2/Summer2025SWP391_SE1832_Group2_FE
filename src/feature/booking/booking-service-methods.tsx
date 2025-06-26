import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceMethodOption } from './service-method-option';
import { Home, MapPin, Package } from 'lucide-react';
import type { BookingFormValues } from '@/lib/zod/booking';
import type { UseFormReturn } from 'react-hook-form';

// Constants
export const SERVICE_METHODS = {
  AT_FACILITY: 'TAI_CO_SO_Y_TE',
  SELF_COLLECTION: 'TU_THU_MAU',
  STAFF_VISIT: 'NHAN_VIEN_DEN_NHA',
} as const;

type BookingServiceMethodsProps = {
  service: {
    isAtHome: boolean;
    isStaffSuport: boolean;
  };
  form: UseFormReturn<BookingFormValues>;
  selectedMethod: string;
};

export const BookingServiceMethods = ({
  service,
  form,
  selectedMethod,
}: BookingServiceMethodsProps) => (
  <Card className='border-0 shadow-xl rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
    <CardHeader>
      <CardTitle className='text-2xl'>Chọn phương thức thực hiện</CardTitle>
      <CardDescription>Chọn cách thức lấy mẫu phù hợp với nhu cầu của bạn</CardDescription>
    </CardHeader>
    <CardContent className='space-y-4'>
      <div className='grid grid-cols-1 gap-4'>
        <ServiceMethodOption
          method={SERVICE_METHODS.AT_FACILITY}
          icon={<MapPin className='h-5 w-5 text-primary' />}
          title='Tại cơ sở y tế'
          description='Đến trực tiếp cơ sở y tế để lấy mẫu xét nghiệm'
          form={form}
          selectedMethod={selectedMethod}
        />

        {service.isAtHome && (
          <ServiceMethodOption
            method={SERVICE_METHODS.SELF_COLLECTION}
            icon={<Package className='h-5 w-5 text-primary' />}
            title='Tự thu mẫu'
            description='Nhận bộ kit và tự thu mẫu tại nhà'
            form={form}
            selectedMethod={selectedMethod}
          />
        )}

        {service.isStaffSuport && (
          <ServiceMethodOption
            method={SERVICE_METHODS.STAFF_VISIT}
            icon={<Home className='h-5 w-5 text-primary' />}
            title='Nhân viên đến nhà'
            description='Nhân viên y tế đến tận nhà để lấy mẫu'
            form={form}
            selectedMethod={selectedMethod}
          />
        )}
      </div>
    </CardContent>
  </Card>
);
