import { ErrorMessage } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/toast';
import {
  BookingHeroSection,
  BookingServiceMethods,
  BookingTimeline,
  BookingDateTimePicker,
  BookingAddressField,
  BookingPriceSummary,
  BookingWarningDialog,
  SERVICE_METHODS,
  needsAddress,
} from '@/feature/booking';
import { useBooking } from '@/hooks/useBooking';
import { useService } from '@/hooks/useService';
import { bookingDefaultValues, bookingFormSchema, type BookingFormValues } from '@/lib/zod/booking';
import { useAuthStore } from '@/stores/auth';
import { paths } from '@/utils/constant/path';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useWorkSchedule from '@/hooks/useWorkSchedule';

const BookingPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { createBookingMutation, checkExistingNearBookingQuery } = useBooking();
  const { getWorkScheduleQuery } = useWorkSchedule();
  const { showToast } = useToast();
  const { queryServiceById } = useService(Number(serviceId));
  const { data: service, isLoading, error, refetch } = queryServiceById;

  // State
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<BookingFormValues | null>(null);

  // Form setup
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      ...bookingDefaultValues,
      serviceId: Number(serviceId),
    },
  });

  const selectedMethod = form.watch('method');

  // Time slots
  const { data: workSchedule } = getWorkScheduleQuery;
  const timeSlots = workSchedule?.map((item) => ({
    id: item.workScheduleId,
    label: `${item.title} (${item.startTime} - ${item.endTime})`,
    value: `${item.startTime}-${item.endTime}`,
  }));

  // Effects
  useEffect(() => {
    form.setValue('buyKit', selectedMethod === SERVICE_METHODS.SELF_COLLECTION);

    if (needsAddress(selectedMethod)) {
      form.setValue('location', user?.address ?? '');
    } else {
      form.setValue('location', 'Cơ sở y tế');
    }
  }, [selectedMethod, form, user?.address]);

  useEffect(() => {
    if (timeSlots?.length) {
      form.setValue('time', timeSlots[0]?.value);
    }
  }, [timeSlots, form]);

  // Handlers
  const createBooking = async (values: BookingFormValues) => {
    try {
      const response = await createBookingMutation.mutateAsync({
        ...values,
        paymentStatus: 'Chưa thanh toán',
        time: values.time,
        userId: user?.userId ?? 0,
        bookingDate: formatISO(new Date(), { representation: 'complete' }),
        collectionDate: formatISO(values.collectionDate, { representation: 'complete' }),
      });

      showToast('Booking created successfully', 'success');
      setTimeout(() => {
        window.location.href = response;
      }, 1000);
    } catch (error: any) {
      showToast(error?.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    }
  };
  console.log(checkExistingNearBookingQuery.data);

  const onSubmit = async (values: BookingFormValues) => {
    if (!isAuthenticated) {
      showToast('Please login to book a service', 'error');
      navigate(paths.login);
      return;
    }

    const isExistingNearBooking = checkExistingNearBookingQuery.data;
    if (isExistingNearBooking) {
      setPendingBookingData(values);
      setShowWarningDialog(true);
      return;
    }

    await createBooking(values);
  };

  const handleConfirmBooking = async () => {
    if (pendingBookingData) {
      setShowWarningDialog(false);
      await createBooking(pendingBookingData);
      setPendingBookingData(null);
    }
  };

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
      <BookingHeroSection service={service} />

      {/* Service Method Selection and Process Timeline */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
        <BookingServiceMethods service={service} form={form} selectedMethod={selectedMethod} />
        <BookingTimeline selectedMethod={selectedMethod} />
      </div>

      {/* Booking Form */}
      <div className='w-full'>
        <Card className='border-0 shadow-xl rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className='space-y-6'>
                <BookingDateTimePicker form={form} timeSlots={timeSlots} />

                {needsAddress(selectedMethod) && <BookingAddressField form={form} />}

                <Separator className='my-6' />

                <BookingPriceSummary price={service.price} />

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

      <BookingWarningDialog
        isOpen={showWarningDialog}
        onClose={handleCancelBooking}
        onConfirm={handleConfirmBooking}
        isLoading={createBookingMutation.isPending}
      />
    </div>
  );
};

export default BookingPage;
