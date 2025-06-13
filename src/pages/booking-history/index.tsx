import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import type { Booking } from '@/types/booking';
import { getBookingsByUserId } from '@/services/booking_service';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { paths } from '@/utils/constant/path';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const BookingHistoryPage = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.userId) return;
      setLoading(true);
      try {
        const data = await getBookingsByUserId(user.userId);
        setBookings(data);
      } catch (err) {
        console.error('Lỗi khi fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.userId]);

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === '0001-01-01T00:00:00') return 'Chưa chọn';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Lịch sử đặt lịch</h2>

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full h-8 rounded" />
          ))}
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <p className="text-muted-foreground">Bạn chưa có lịch sử booking nào.</p>
      )}

      {!loading && bookings.length > 0 && (
        <div className="overflow-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Mua kit</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Thời gian lấy mẫu</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Ngày mong muốn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Kết quả</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.bookingId} className="hover:bg-muted/50">
                  <TableCell>
                    <Link
                      to={paths.bookingDetail(String(booking.bookingId))}
                      className="text-primary underline"
                    >
                      #{booking.bookingId}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(booking.bookingDate)}</TableCell>
                  <TableCell>{booking.method}</TableCell>
                  <TableCell>{booking.buyKit ? 'Có' : 'Không'}</TableCell>
                  <TableCell>{booking.paymentStatus}</TableCell>
                  <TableCell>{booking.time || 'Chưa có'}</TableCell>
                  <TableCell>{booking.location || 'Chưa có'}</TableCell>
                  <TableCell>{formatDate(booking.preferredDate)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{booking.status}</Badge>
                  </TableCell>
                  <TableCell>{booking.result ?? 'Chưa có'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
