import {
  Activity,
  ArrowLeft,
  CalendarArrowDown,
  CalendarCheck,
  CalendarCog,
  Clock,
  MapPin,
  PackageCheck,
  Star,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ResultContent } from '@/components/common/ResultContent';
import { RatingDialog, RatingDisplay } from '@/components/common/rating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getBookingById } from '@/services/booking_service';
import type { Booking } from '@/types/booking';

const BookingDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!bookingId || isNaN(bookingId)) return;

    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === '0001-01-01T00:00:00') return 'Chưa chọn';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const formatTime = (time: string) => {
    if (!time) return 'Chưa có';
    if (time.includes('-')) {
      const [start, end] = time.split('-');
      return `${start.split(':').slice(0, 2).join(':')} - ${end.split(':').slice(0, 2).join(':')}`;
    }
    if (time.match(/^\d{2}:\d{2}:\d{2}$/)) {
      return time.split(':').slice(0, 2).join(':');
    }
    return time;
  };

  const methodMap: Record<string, string> = {
    TAI_CO_SO_Y_TE: 'Tại cơ sở y tế ',
    NHAN_VIEN_DEN_NHA: 'Nhân viên đến nhà',
    TU_THU_MAU: 'Tự thu mẫu',
  };

  const canShowRatingButton = booking?.finalResult && !booking.hasSubmittedRating;

  if (loading) {
    return <Skeleton className='w-full h-48 m-6 rounded-xl' />;
  }

  if (!booking) {
    return <p className='p-6 text-red-500'>Không tìm thấy booking</p>;
  }

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <div className='flex justify-start mb-4'>
        <Button variant='outline' onClick={() => navigate(-1)} className='flex items-center gap-2'>
          <ArrowLeft className='w12-h12' /> Quay lại lịch sử
        </Button>
      </div>

      <div className='bg-white rounded-2xl shadow-md p-6 space-y-6 border'>
        <h1 className='text-3xl font-bold flex items-center gap-2'>
          <PackageCheck className='w-6 h-6' /> Booking #{booking.bookingId}
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <User className='w12-h12 text-muted-foreground' />
              <span>Người đặt: {booking.fullName || 'Chưa có'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <CalendarArrowDown className='w12-h12 text-muted-foreground' />
              <span>Ngày đặt: {formatDate(booking.bookingDate)}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Activity className='w12-h12 text-muted-foreground' />
              <span>Phương thức: {methodMap[booking.method] ?? booking.method}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w12-h12 text-muted-foreground' />
              <span>Khung giờ: {formatTime(booking.time)}</span>
            </div>
          </div>

          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <CalendarCog className='w12-h12 text-muted-foreground' />
              <span>Ngày lấy mẫu: {formatDate(booking.collectionDate)}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w12-h12 text-muted-foreground' />
              <span>Khung giờ: {formatTime(booking.time)}</span>
            </div>
            <div className='flex items-center gap-2'>
              <CalendarCheck className='w12-h12 text-muted-foreground' />
              <span>Ngày trả kết quả: {formatDate(booking.preferredDate)}</span>
            </div>
          </div>
        </div>

        <div className='flex items-start gap-2'>
          <MapPin className='w12-h12 text-muted-foreground mt-1' />
          <span>
            <strong>Địa điểm:</strong> {booking.location || 'Chưa có'}
          </span>
        </div>

        <div className='flex flex-wrap gap-3'>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={
                  booking.resultDetails && booking.resultDetails.length > 0 ? 'complete' : 'error'
                }
                disabled={!booking.resultDetails || booking.resultDetails.length === 0}
              >
                {booking.resultDetails && booking.resultDetails.length > 0
                  ? 'Xem kết quả'
                  : 'Chưa có kết quả'}
              </Button>
            </DialogTrigger>

            <DialogContent className='!w-[60vw] !max-w-none !max-h-[100vh] overflow-auto'>
              <DialogHeader>
                <DialogTitle>Kết quả Booking #{booking.bookingId}</DialogTitle>
              </DialogHeader>

              <ResultContent resultDetails={booking.resultDetails || []} />

              <div className=''>
                <span className='font-semibold'>Lời nhận xét:</span>{' '}
                {booking.finalResult || (
                  <span className='text-muted-foreground italic'>Chưa có</span>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {canShowRatingButton && (
            <RatingDialog
              bookingId={booking.bookingId}
              onRatingSuccess={() => {
                setBooking({ ...booking, hasSubmittedRating: true });
              }}
              trigger={
                <Button variant='outline' className='gap-2'>
                  <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                  Đánh giá dịch vụ
                </Button>
              }
            />
          )}

          {booking.hasSubmittedRating && <RatingDisplay bookingId={booking.bookingId} />}
        </div>

        <div>
          <Badge variant='outline' className='uppercase'>
            {booking.status}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
