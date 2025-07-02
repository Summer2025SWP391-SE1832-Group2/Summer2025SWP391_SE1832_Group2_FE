import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import type { Booking } from '@/types/booking';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { paths } from '@/utils/constant/path';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getBookingsByUserId } from '@/services/booking_service';

const ITEMS_PER_PAGE = 10;

const BookingHistoryPage = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.userId) return;
      try {
        const data = await getBookingsByUserId(user.userId);
        setBookings(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách booking:', error);
      }
    };

    fetchBookings();
  }, [user?.userId]);

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === '0001-01-01T00:00:00') return 'Chưa chọn';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const formatTime = (time: string) => {
    if (!time) return 'Chưa có';

    // Nếu là dạng "HH:mm:ss-HH:mm:ss"
    if (time.includes('-')) {
      const [start, end] = time.split('-');
      return `${start.split(':').slice(0, 2).join(':')} - ${end.split(':').slice(0, 2).join(':')}`;
    }

    // Nếu chỉ có một mốc thời gian dạng "HH:mm:ss"
    if (time.match(/^\d{2}:\d{2}:\d{2}$/)) {
      return time.split(':').slice(0, 2).join(':');
    }

    return time;
  };


  const methodMap: Record<string, string> = {
    TAI_CO_SO_Y_TE: 'Cơ sở y tế tại SWP391',
    NHAN_VIEN_DEN_NHA: 'Nhân viên đến nhà',
    TU_THU_MAU: 'Tự thu mẫu',
  };

  const getBookingStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'đã lấy mẫu':
        return 'bg-blue-100 text-blue-700';
      case 'đang chờ xử lý':
        return 'bg-orange-100 text-orange-800';
      case 'hoàn thành':
        return 'bg-green-100 text-green-700';
      case 'đã huỷ':
        return 'bg-gray-200 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  const getPaymentStatusColor = (paymentStatus: string) => {
  switch (paymentStatus.toLowerCase()) {
    case 'đã thanh toán':
      return 'bg-green-100 text-green-700';
    case 'chưa thanh toán':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};


  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  const reversedBookings = [...bookings].reverse();
  const currentBookings = reversedBookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Lịch sử đặt lịch</h2>

      {bookings.length === 0 ? (
        <p className="text-muted-foreground">Bạn chưa có lịch sử booking nào.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Ngày trả</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBookings.map((booking) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell>#{booking.bookingId}</TableCell>
                    <TableCell>
                      <Badge className={getBookingStatusColor(booking.status||"")}>{booking.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(booking.paymentStatus)} variant="secondary">
                        {booking.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(booking.bookingDate)}</TableCell>
                    <TableCell>{formatDate(booking.preferredDate)}</TableCell>
                    <TableCell>{formatTime(booking.time)}</TableCell>
                    <TableCell>{methodMap[booking.method] ?? booking.method}</TableCell>
                    <TableCell>{booking.location || 'Chưa có'}</TableCell>
                    <TableCell className="text-right">
                      <Link to={paths.bookingDetail(String(booking.bookingId))}>
                        <Button variant="outline" size="sm">
                          Chi tiết
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination className="mt-4 justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={handlePrevPage} />
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm text-muted-foreground px-4">
                  Trang {currentPage} / {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={handleNextPage} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default BookingHistoryPage;
