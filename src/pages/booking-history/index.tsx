import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth';
import type { Booking } from '@/types/booking';
import { getBookingsByUserId } from '@/services/booking_service';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { paths } from '@/utils/constant/path';
import { Button } from '@/components/ui/button';

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

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'ready':
                return 'bg-green-100 text-green-700';
            case 'in progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-700';
            case 'paid':
                return 'bg-green-200 text-green-800';
            case 'unpaid':
                return 'bg-red-100 text-red-700';
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            case 'failed':
                return 'bg-rose-100 text-rose-700';
            case 'cancelled':
                return 'bg-gray-200 text-gray-600';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };
    

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Lịch sử đặt lịch</h2>

            {loading && (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="w-full h-40 rounded-xl" />
                    ))}
                </div>
            )}

            {!loading && bookings.length === 0 && (
                <p className="text-muted-foreground">Bạn chưa có lịch sử booking nào.</p>
            )}

            {!loading && bookings.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {bookings.map((booking) => (
                 <Card key={booking.bookingId} className="rounded-2xl shadow-md p-4 space-y-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="font-semibold text-sm text-muted-foreground">Mã đơn #{booking.bookingId}</p>
                       <p className="text-base font-medium">{user?.fullName ?? 'Khách hàng'}</p>
                     </div>
                     <div className="flex flex-col gap-1 items-end">
                       <Badge className={getStatusColor(booking.status)}>
                         {booking.status}
                       </Badge>
                       <Badge variant="secondary">
                         {booking.paymentStatus}
                       </Badge>
                     </div>
                   </div>
             
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                     {/* Block: Ngày đặt - Ngày mong muốn - Thời gian */}
                     <div className="space-y-1">
                       <p><strong>Ngày đặt:</strong> {formatDate(booking.bookingDate)}</p>
                       <p><strong>Ngày trả kết quả :</strong> {formatDate(booking.preferredDate)}</p>
                       <p><strong>Thời gian:</strong> {booking.time || 'Chưa có'}</p>
                     </div>
             
                     {/* Block: Phương thức - Địa điểm */}
                     <div className="space-y-1">
                       <p><strong>Phương thức:</strong> {booking.method}</p>
                       <p>
  <strong>Địa điểm:</strong>{' '}
  {booking.method === 'AtFacility' ? 'Cơ sở y tế tại SWP391' : (booking.location || 'Chưa có')}
</p>                     </div>
                   </div>
             
                   <div className="flex justify-between">
                     <Link to={paths.bookingDetail(String(booking.bookingId))}>
                       <Button variant="outline" size="sm">Chi tiết</Button>
                     </Link>
                   </div>
                 </Card>
               ))}
             </div>
             
            )}
        </div>
    );
};

export default BookingHistoryPage;
