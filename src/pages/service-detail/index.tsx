import { ErrorMessage } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { TimeInputGroup } from '@/components/ui/time-picker/time-input-group';
import { Timeline, TimelineItem } from '@/components/ui/timeline/timeline';
import { useToast } from '@/components/ui/toast';
import ServiceMethodOption from '@/feature/service-detail/service-method-option';
import { useService } from '@/hooks/useService';
import { useBooking } from '@/hooks/useBooking';
import { cn } from '@/lib/utils';
import { bookingFormSchema, type BookingFormValues } from '@/lib/zod/booking';
import { useAuthStore } from '@/stores/auth';
import { paths } from '@/utils/constant/path';
import {
  atFacilitySteps,
  selfCollectionSteps,
  staffVisitSteps,
} from '@/utils/constant/timeline-services';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, formatISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, Home, MapPin, Package } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { createBookingMutation } = useBooking();
  const { showToast } = useToast();
  const { queryServiceById } = useService(Number(id));
  const { data: service, isLoading, error, refetch } = queryServiceById;

  // Form setup with Zod validation
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceId: Number(id),
      bookingDate: new Date(),
      method: 'AtFacility',
      location: 'Medical Facility',
      buyKit: false,
    },
  });

  const selectedMethod = form.watch('method');

  // Update values when method changes
  useEffect(() => {
    form.setValue('buyKit', selectedMethod === 'SelfCollection');

    if (selectedMethod === 'AtFacility') {
      form.setValue('location', 'Medical Facility');
    } else {
      form.setValue('location', '');
    }
  }, [selectedMethod, form]);

  // Get timeline steps based on selected method
  const getTimelineSteps = () => {
    switch (selectedMethod) {
      case 'SelfCollection':
        return selfCollectionSteps;
      case 'StaffVisit':
        return staffVisitSteps;
      default:
        return atFacilitySteps;
    }
  };

  // Handle form submission
  const onSubmit = async (values: BookingFormValues) => {
    if (!isAuthenticated) {
      showToast('Please login to book a service', 'error');
      navigate(paths.login);
      return;
    }

    try {
      const resposne = await createBookingMutation.mutateAsync({
        ...values,
        status: 'Pending',
        paymentStatus: 'Unpaid',
        time: format(values.bookingDate, 'HH:mm:ss'),
        userId: user?.userId ?? 0,
        bookingDate: formatISO(values.bookingDate, { representation: 'complete' }),
      });

      showToast('Booking created successfully', 'success');

      setTimeout(() => {
        window.location.href = resposne;
      }, 1000);
    } catch (error: any) {
      showToast(error?.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[70vh]'>
        <Loading />
      </div>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[70vh]'>
        <ErrorMessage
          message={error ? 'Failed to load service details' : 'Service not found'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className='container max-w-6xl mx-auto py-12 px-4 sm:px-6'>
      {/* Hero Section */}
      <section className='mb-16 text-center'>
        <span className='inline-block text-sm font-medium text-primary mb-3 tracking-wider uppercase'>
          DNA Testing Service
        </span>
        <h1 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent h-15'>
          {service.name}
        </h1>
        <p className='text-xl text-muted-foreground max-w-3xl mx-auto mb-8'>
          {service.description}
        </p>
        <div className='flex flex-wrap items-center justify-center gap-6'>
          <div className='bg-primary/10 dark:bg-primary/20 rounded-full px-6 py-3 flex items-center gap-2'>
            <span className='font-medium'>Thời gian xử lý: {service.durationDays} ngày</span>
          </div>
          <div className='bg-primary/10 dark:bg-primary/20 rounded-full px-6 py-3 flex items-center gap-2'>
            <span className='font-medium text-lg'>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                service.price,
              )}
            </span>
          </div>
        </div>
      </section>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        {/* Main Content */}
        <div className='lg:col-span-7'>
          <Card className='border-0 shadow-xl rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
            <CardHeader>
              <CardTitle className='text-2xl'>Chọn phương thức thực hiện</CardTitle>
              <CardDescription>Chọn cách thức lấy mẫu phù hợp với nhu cầu của bạn</CardDescription>
            </CardHeader>

            <CardContent className='space-y-6'>
              {/* Service Method Options */}
              <div className='grid grid-cols-1 gap-4'>
                <ServiceMethodOption
                  method='AtFacility'
                  icon={<MapPin className='h-5 w-5 text-primary' />}
                  title='Tại cơ sở y tế'
                  description='Đến trực tiếp cơ sở y tế để lấy mẫu xét nghiệm'
                  form={form}
                  selectedMethod={selectedMethod}
                />

                {service.isAtHome && (
                  <ServiceMethodOption
                    method='SelfCollection'
                    icon={<Package className='h-5 w-5 text-primary' />}
                    title='Tự thu mẫu'
                    description='Nhận bộ kit và tự thu mẫu tại nhà'
                    form={form}
                    selectedMethod={selectedMethod}
                  />
                )}

                {service.isStaffSuport && (
                  <ServiceMethodOption
                    method='StaffVisit'
                    icon={<Home className='h-5 w-5 text-primary' />}
                    title='Nhân viên đến nhà'
                    description='Nhân viên y tế đến tận nhà để lấy mẫu'
                    form={form}
                    selectedMethod={selectedMethod}
                  />
                )}
              </div>

              {/* Process Timeline */}
              <div className='mt-12'>
                <h3 className='text-xl font-medium mb-6'>Quy trình xét nghiệm</h3>
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <div className='lg:col-span-5'>
          <Card className='border-0 shadow-xl rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 sticky top-24'>
            <CardHeader className='border-b border-border/30 pb-6'>
              <CardTitle className='text-2xl'>Đặt lịch xét nghiệm</CardTitle>
              <CardDescription>Hoàn tất thông tin để đặt lịch</CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className='pt-6 space-y-6'>
                  {/* Date Picker */}
                  <FormField
                    control={form.control}
                    name='bookingDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Ngày hẹn</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant='outline'
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP HH:mm:ss', { locale: vi })
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align='start' className='w-auto p-0'>
                            <Calendar
                              mode='single'
                              captionLayout='dropdown-buttons'
                              selected={field.value}
                              onSelect={field.onChange}
                              fromYear={1960}
                              toYear={2030}
                            />
                            <div className='p-3 border-t border-border'>
                              <TimeInputGroup date={field.value} setDate={field.onChange} />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address Field (conditional) */}
                  {(selectedMethod === 'StaffVisit' || selectedMethod === 'SelfCollection') && (
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
                  )}

                  <Separator className='my-6' />

                  {/* Price and Submit Button */}
                  <div className='bg-primary/5 dark:bg-primary/10 p-4 rounded-lg'>
                    <div className='flex items-center justify-between mb-4'>
                      <span className='text-muted-foreground'>Giá dịch vụ:</span>
                      <span>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(service.price)}
                      </span>
                    </div>

                    <div className='flex items-center justify-between font-medium'>
                      <span>Tổng cộng:</span>
                      <span className='text-xl font-bold text-primary'>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(service.price)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type='submit'
                    size='lg'
                    className='w-full py-6 text-lg'
                    disabled={createBookingMutation.isPending}
                  >
                    {createBookingMutation.isPending ? 'Đang xử lý...' : 'Đặt lịch ngay'}
                  </Button>
                </CardContent>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
