import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Timeline, TimelineItem } from '@/components/ui/timeline/timeline';
import { Package } from 'lucide-react';
import {
  atFacilitySteps,
  selfCollectionSteps,
  staffVisitSteps,
} from '@/utils/constant/timeline-services';
import { SERVICE_METHODS } from './booking-service-methods';

type BookingTimelineProps = {
  selectedMethod: string;
};

export const BookingTimeline = ({ selectedMethod }: BookingTimelineProps) => {
  const getTimelineSteps = () => {
    switch (selectedMethod) {
      case SERVICE_METHODS.SELF_COLLECTION:
        return selfCollectionSteps;
      case SERVICE_METHODS.STAFF_VISIT:
        return staffVisitSteps;
      default:
        return atFacilitySteps;
    }
  };

  return (
    <Card className='border-0 shadow-xl rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
      <CardHeader>
        <CardTitle className='text-2xl'>Quy trình xét nghiệm</CardTitle>
        <CardDescription>
          {selectedMethod
            ? 'Quy trình thực hiện cho phương thức đã chọn'
            : 'Chọn phương thức để xem quy trình chi tiết'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedMethod ? (
          <div className='bg-white/50 dark:bg-black/20 rounded-lg p-6'>
            <Timeline size='md' className='max-w-md mx-auto'>
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
          </div>
        ) : (
          <div className='flex items-center justify-center h-64 text-muted-foreground'>
            <div className='text-center space-y-4'>
              <div className='bg-primary/10 p-4 rounded-full w-fit mx-auto'>
                <Package className='h-12 w-12 text-primary/60' />
              </div>
              <div>
                <p className='text-lg font-medium'>Vui lòng chọn phương thức thực hiện</p>
                <p className='text-sm text-muted-foreground/80'>để xem quy trình chi tiết</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
