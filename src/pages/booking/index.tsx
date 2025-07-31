import { ErrorMessage } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/toast';
import {
  BookingMethodStep,
  BookingStepsProgress,
  BookingWarningDialog,
  ConfirmationStep,
  SampleInfoStep,
  ScheduleStep,
} from '@/feature/booking';
import { useBooking } from '@/hooks/useBooking';
import { useService } from '@/hooks/useService';
import useWorkSchedule from '@/hooks/useWorkSchedule';
import { bookingDefaultValues, bookingFormSchema, type BookingFormValues } from '@/lib/zod/booking';
import { useAuthStore } from '@/stores/auth';
import { paths } from '@/utils/constant/path';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatISO } from 'date-fns';
import { CalendarIcon, Check, ChevronLeft, ChevronRight, Package, TestTube } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const sampleTypeOptions = [
  { label: 'Tóc', value: 'Tóc' },
  { label: 'Máu', value: 'Máu' },
  { label: 'Nước tiểu', value: 'Nước tiểu' },
  { label: 'Khác', value: 'Khác' },
];

const niptSampleTypeOptions = [
  { label: 'Máu tĩnh mạch', value: 'Máu tĩnh mạch' },
  { label: 'Máu ngoại vi', value: 'Máu ngoại vi' },
];

const relationshipOptions = [
  { label: 'Cha', value: 'Cha' },
  { label: 'Mẹ', value: 'Mẹ' },
  { label: 'Con', value: 'Con' },
  { label: 'Khác', value: 'Khác' },
];

const steps = [
  { id: 1, title: 'Chọn phương thức', icon: Package },
  { id: 2, title: 'Thông tin mẫu', icon: TestTube },
  { id: 3, title: 'Thời gian & địa điểm', icon: CalendarIcon },
  { id: 4, title: 'Xác nhận & thanh toán', icon: Check },
];

const BookingPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { createBookingMutation, checkExistingNearBookingQuery } = useBooking();
  const { getWorkScheduleQuery } = useWorkSchedule();
  const { showToast } = useToast();
  const { queryServiceById } = useService(Number(serviceId));
  const { data: service, isLoading, error, refetch } = queryServiceById;

  // Check if this is NIPT service (serviceId = 7)
  const isNiptService = Number(serviceId) === 7;

  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Dialog state
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<BookingFormValues | null>(null);

  // Prepare default values based on service type
  const defaultValues = useMemo(() => {
    if (isNiptService) {
      return {
        ...bookingDefaultValues,
        serviceId: Number(serviceId),
        samples: [
          {
            sampleType: '',
            participantName: '',
            notes: 'Mẹ',
          },
        ],
      };
    }
    return {
      ...bookingDefaultValues,
      serviceId: Number(serviceId),
    };
  }, [serviceId, isNiptService]);

  // Form setup with validation
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  });

  const selectedMethod = form.watch('method');
  const samples = form.watch('samples');

  // Time slots
  const { data: workSchedule } = getWorkScheduleQuery;
  const timeSlots = useMemo(() => {
    return workSchedule?.map((item) => ({
      id: item.workScheduleId,
      label: `${item.title} (${item.startTime} - ${item.endTime})`,
      value: `${item.startTime}-${item.endTime}`,
    }));
  }, [workSchedule]);

  // Update values when method changes
  useEffect(() => {
    form.setValue('buyKit', selectedMethod === 'TU_THU_MAU');
    if (selectedMethod === 'TU_THU_MAU' || selectedMethod === 'NHAN_VIEN_DEN_NHA') {
      form.setValue('location', user?.address ?? '');
    } else {
      form.setValue('location', '123 Nguyễn Thị Minh Khai, Q.1, TP.HCM');
    }
    if (workSchedule && !form.getValues('time') && timeSlots?.[0]?.value) {
      form.setValue('time', timeSlots?.[0]?.value);
    }
  }, [selectedMethod, timeSlots]);

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return !!selectedMethod;
      case 2:
        if (isNiptService) {
          // For NIPT, only validate the first sample
          return (
            samples[0] && samples[0].sampleType && samples[0].participantName && samples[0].notes
          );
        }
        // For other services, validate both samples
        return (
          samples.length === 2 &&
          samples.every((sample) => sample.sampleType && sample.participantName && sample.notes)
        );
      case 3:
        const collectionDate = form.watch('collectionDate');
        const time = form.watch('time');
        const location = form.watch('location');
        console.log('collectionDate', collectionDate, 'time', time, 'location', location);
        return !!collectionDate && !!time && !!location;
      default:
        return true;
    }
  };

  // Reset form when service changes
  useEffect(() => {
    form.reset(defaultValues);
    setCurrentStep(1);
  }, [service?.serviceId]);

  const nextStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle actual booking creation
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

      showToast('Tạo thành công', 'success');

      setTimeout(() => {
        window.location.href = response;
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
      setPendingBookingData(values);
      setShowWarningDialog(true);
      return;
    }
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BookingMethodStep form={form} service={service} />;

      case 2:
        return (
          <SampleInfoStep
            form={form}
            sampleTypeOptions={isNiptService ? niptSampleTypeOptions : sampleTypeOptions}
            relationshipOptions={relationshipOptions}
            isNiptService={isNiptService}
          />
        );

      case 3:
        return <ScheduleStep form={form} timeSlots={timeSlots} selectedMethod={selectedMethod} />;

      case 4:
        return (
          <ConfirmationStep
            form={form}
            service={service}
            samples={samples}
            selectedMethod={selectedMethod}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='container max-w-6xl mx-auto py-8 px-4 sm:px-6'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
            {service.name}
          </h1>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>{service.description}</p>
        </div>

        {/* Progress Steps */}
        <BookingStepsProgress steps={steps} currentStep={currentStep} />

        {/* Main Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className='border-0 shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm'>
              <CardContent className='p-8'>{renderStepContent()}</CardContent>

              {/* Navigation */}
              <div className='bg-gray-50 dark:bg-gray-800 px-8 py-6 flex justify-between items-center'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={(e) => prevStep(e)}
                  disabled={currentStep === 1}
                  className='flex items-center gap-2'
                >
                  <ChevronLeft className='h-4 w-4' />
                  Quay lại
                </Button>

                <div className='text-sm text-muted-foreground'>
                  Bước {currentStep} / {steps.length}
                </div>

                {currentStep < 4 ? (
                  <Button
                    type='button'
                    onClick={(e) => nextStep(e)}
                    disabled={!isStepValid(currentStep)}
                    className='flex items-center gap-2'
                  >
                    Tiếp tục
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                ) : (
                  <Button
                    type='submit'
                    size='lg'
                    disabled={createBookingMutation.isPending}
                    className='flex items-center gap-2'
                  >
                    {createBookingMutation.isPending ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Check className='h-4 w-4' />
                        Đặt lịch ngay
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </form>
        </Form>

        {/* Warning Dialog */}
        <BookingWarningDialog
          showWarningDialog={showWarningDialog}
          setShowWarningDialog={setShowWarningDialog}
          handleCancelBooking={handleCancelBooking}
          handleConfirmBooking={handleConfirmBooking}
          isPending={createBookingMutation.isPending}
        />
      </div>
    </div>
  );
};

export default BookingPage;
