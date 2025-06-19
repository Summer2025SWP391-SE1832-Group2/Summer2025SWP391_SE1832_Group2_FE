import { ErrorMessage } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Timeline, TimelineItem } from '@/components/ui/timeline/timeline';
import { useToast } from '@/components/ui/toast';
import ServiceMethodOption from '@/feature/booking/service-method-option';
import { useBooking } from '@/hooks/useBooking';
import { useService } from '@/hooks/useService';
import { cn } from '@/lib/utils';
import {
  bookingDefaultValues,
  bookingFormSchema,
  type BookingFormValues,
  TIME_SLOTS,
} from '@/lib/zod/booking';
import { useAuthStore } from '@/stores/auth';
import { paths } from '@/utils/constant/path';
import {
  atFacilitySteps,
  selfCollectionSteps,
  staffVisitSteps,
} from '@/utils/constant/timeline-services';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, formatISO } from 'date-fns';
import { AlertTriangle, CalendarIcon, Home, MapPin, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const BookingPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { createBookingMutation, checkExistingNearBookingQuery } = useBooking();
  const { showToast } = useToast();
  const { queryServiceById } = useService(Number(serviceId));
  const { data: service, isLoading, error, refetch } = queryServiceById;

  // Dialog state
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<BookingFormValues | null>(null);
  // Form setup with Zod validation
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      ...bookingDefaultValues,
      serviceId: Number(serviceId),
    },
  });
  console.log(form.formState.errors);
  const selectedMethod = form.watch('method');

  // Update values when method changes
  useEffect(() => {
    form.setValue('buyKit', selectedMethod === 'TU_THU_MAU');
    if (selectedMethod === 'TU_THU_MAU' || selectedMethod === 'NHAN_VIEN_DEN_NHA') {
      form.setValue('location', user?.address ?? '');
    } else {
      form.setValue('location', 'Cơ sở y tế');
    }
  }, [selectedMethod, form]);

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

  // Handle actual booking creation
  const createBooking = async (values: BookingFormValues) => {
    try {
      const resposne = await createBookingMutation.mutateAsync({
        ...values,
        status: 'Pending',
        paymentStatus: 'Unpaid',
        time: values.time, // This will be in format '7:30:00-9:00:00'
        userId: user?.userId ?? 0,
        bookingDate: formatISO(new Date(), { representation: 'complete' }),
        collectionDate: formatISO(values.collectionDate, { representation: 'complete' }),
      });

      showToast('Booking created successfully', 'success');

      setTimeout(() => {
        window.location.href = resposne;
      }, 1000);
    } catch (error: any) {
      showToast(error?.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    }
  };

  // Handle form submission
  const onSubmit = async (values: BookingFormValues) => {
    if (!isAuthenticated) {
      showToast('Please login to book a service', 'error');
      navigate(paths.login);
      return;
    }

    const isExistingNearBooking = checkExistingNearBookingQuery.data;
    if (isExistingNearBooking) {
      // Show warning dialog if there's an existing near booking
      setPendingBookingData(values);
      setShowWarningDialog(true);
      return;
    }

    // Proceed with booking if no existing near booking
    await createBooking(values);
  };

  // Handle confirmation from dialog
  const handleConfirmBooking = async () => {
    if (pendingBookingData) {
      setShowWarningDialog(false);
      await createBooking(pendingBookingData);
      setPendingBookingData(null);
    }
  };

  // Handle cancel from dialog
  const handleCancelBooking = () => {
    setShowWarningDialog(false);
    setPendingBookingData(null);
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

      {/* Service Method Selection and Process Timeline - Side by Side */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
        {/* Service Method Options */}
        <Card className='border-0 shadow-xl rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
          <CardHeader>
            <CardTitle className='text-2xl'>Chọn phương thức thực hiện</CardTitle>
            <CardDescription>Chọn cách thức lấy mẫu phù hợp với nhu cầu của bạn</CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
              <ServiceMethodOption
                method='TAI_CO_SO_Y_TE'
                icon={<MapPin className='h-5 w-5 text-primary' />}
                title='Tại cơ sở y tế'
                description='Đến trực tiếp cơ sở y tế để lấy mẫu xét nghiệm'
                form={form}
                selectedMethod={selectedMethod}
              />

              {service.isAtHome && (
                <ServiceMethodOption
                  method='TU_THU_MAU'
                  icon={<Package className='h-5 w-5 text-primary' />}
                  title='Tự thu mẫu'
                  description='Nhận bộ kit và tự thu mẫu tại nhà'
                  form={form}
                  selectedMethod={selectedMethod}
                />
              )}

              {service.isStaffSuport && (
                <ServiceMethodOption
                  method='NHAN_VIEN_DEN_NHA'
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

        {/* Process Timeline - Interactive */}
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
      </div>

      {/* Booking Form - Full Width Below */}
      <div className='w-full'>
        <Card className='border-0 shadow-xl rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className='space-y-6'>
                {/* Date Picker */}
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
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Chọn khung giờ phù hợp' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TIME_SLOTS.map((slot) => (
                              <SelectItem
                                key={slot.id}
                                value={slot.value}
                                className='cursor-pointer'
                              >
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

                {/* Address Field (conditional) */}
                {(selectedMethod === 'NHAN_VIEN_DEN_NHA' || selectedMethod === 'TU_THU_MAU') && (
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

      {/* Warning Dialog */}
      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-amber-500' />
              Cảnh báo lịch đặt trùng lặp
            </DialogTitle>
            <DialogDescription className='text-left'>
              Bạn đã có một lịch đặt gần đây. Việc đặt thêm lịch mới có thể gây xung đột thời gian.
              <br />
              <br />
              Bạn có chắc chắn muốn tiếp tục đặt lịch mới không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex flex-col-reverse sm:flex-row gap-2'>
            <Button variant='outline' onClick={handleCancelBooking}>
              Hủy bỏ
            </Button>
            <Button onClick={handleConfirmBooking} disabled={createBookingMutation.isPending}>
              {createBookingMutation.isPending ? 'Đang xử lý...' : 'Tiếp tục đặt lịch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingPage;
