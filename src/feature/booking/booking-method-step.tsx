import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { ServiceMethodOption } from './service-method-option';
import { Timeline, TimelineItem } from '@/components/ui/timeline/timeline';
import type { UseFormReturn } from 'react-hook-form';
import type { BookingFormValues } from '@/lib/zod/booking';
import type { ServiceResponse } from '@/types/services';
import {
  atFacilitySteps,
  selfCollectionSteps,
  staffVisitSteps,
} from '@/utils/constant/timeline-services';
import { MapPin, Package, Home } from 'lucide-react';

interface BookingMethodStepProps {
  form: UseFormReturn<BookingFormValues>;
  service: ServiceResponse;
}

export function BookingMethodStep({ form, service }: BookingMethodStepProps) {
  const selectedMethod = form.watch('method');

  const getTimelineSteps = () => {
    switch (selectedMethod) {
      case 'TU_THU_MAU':
        return selfCollectionSteps;
      case 'NHAN_VIEN_DEN_NHA':
        return staffVisitSteps;
      default:
        return atFacilitySteps;
    }
  };

  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl font-bold mb-2'>Chọn phương thức lấy mẫu</h2>
        <p className='text-muted-foreground'>Chọn cách thức phù hợp với nhu cầu của bạn</p>
      </div>

      <div className='grid grid-cols-1 gap-4 max-w-2xl mx-auto'>
        <ServiceMethodOption
          method='TAI_CO_SO_Y_TE'
          icon={<MapPin className='h-6 w-6 text-primary' />}
          title='Tại cơ sở y tế'
          description='Đến trực tiếp cơ sở y tế để lấy mẫu xét nghiệm'
          form={form}
          selectedMethod={selectedMethod}
        />

        {service.isAtHome && (
          <ServiceMethodOption
            method='TU_THU_MAU'
            icon={<Package className='h-6 w-6 text-primary' />}
            title='Tự thu mẫu tại nhà'
            description='Nhận bộ kit và tự thu mẫu tại nhà (chỉ dành cho xét nghiệm dân sự)'
            form={form}
            selectedMethod={selectedMethod}
          />
        )}

        {service.isStaffSuport && (
          <ServiceMethodOption
            method='NHAN_VIEN_DEN_NHA'
            icon={<Home className='h-6 w-6 text-primary' />}
            title='Nhân viên đến nhà'
            description='Nhân viên y tế đến tận nhà để lấy mẫu (phù hợp cho mọi loại xét nghiệm)'
            form={form}
            selectedMethod={selectedMethod}
          />
        )}
      </div>

      {selectedMethod && (
        <Card className='max-w-2xl mx-auto mt-8'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5' />
              Quy trình thực hiện
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline size='sm'>
              {getTimelineSteps().map((step, index) => (
                <TimelineItem
                  key={index}
                  title={step.title}
                  description={step.description}
                  date={step.date}
                  icon={step.icon}
                  iconColor='primary'
                />
              ))}
            </Timeline>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
