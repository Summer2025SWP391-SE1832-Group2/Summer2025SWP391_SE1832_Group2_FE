import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ResultContent } from '@/components/common/ResultContent';
import { Skeleton } from '@/components/ui/skeleton';
import { getBookingById } from '@/services/booking_service';
import type { Booking } from '@/types/booking';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';

const ViewResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const role = useAuthStore((state) => state.user?.role);

  const backPath =
    role === 'Manager'
      ? '/manager/result'
      : role === 'FacilityStaff' 
      || role === 'TestStaff'
      || role === 'HomeStaff'
        ? '/staff/bookinglist'
        : '/';

  useEffect(() => {
    if (!bookingId || isNaN(bookingId)) return;

    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết booking:', error);
        showToast('Không thể tải thông tin booking.', 'error', 5000);
        navigate(backPath); // fallback nếu lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate, showToast, backPath]);

  if (loading) {
    return <Skeleton className="w-full h-48 m-6 rounded-xl" />;
  }

  if (!booking) {
    return <p className="p-6 text-red-500">Không tìm thấy booking</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="mb-4">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate(backPath)}
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kết quả Booking #{booking.bookingId}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <ResultContent
            resultDetails={booking.resultDetails || []}
            serviceId={booking.serviceId}
          />

          <div>
            <span className="font-semibold">Lời nhận xét:</span>{' '}
            {booking.finalResult || (
              <span className="text-muted-foreground italic">Chưa có</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewResultPage;
