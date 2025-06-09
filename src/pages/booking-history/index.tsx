import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth';
import type { Booking } from '@/types/booking';
import { getBookingsByUserId } from '@/services/booking_service';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { paths } from '@/utils/constant/path';


const BookingHistory = () => {
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
                        <Skeleton key={i} className="w-full h-32 rounded-xl" />
                    ))}
                </div>
            )}

            {!loading && bookings.length === 0 && (
                <p className="text-muted-foreground">Bạn chưa có lịch sử booking nào.</p>
            )}

            {!loading && bookings.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {bookings.map((booking) => (

                        <Link to={paths.bookingDetail(String(booking.bookingId))} key={booking.bookingId}>
                            <Card className="rounded-2xl shadow-sm cursor-pointer hover:border-primary transition-colors duration-200">


                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Mã booking #{booking.bookingId}
                                    </CardTitle>
                                    <Badge variant="outline" className="text-sm">
                                        {booking.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-1 text-sm text-muted-foreground">
                                    <p><strong>Ngày đặt:</strong> {formatDate(booking.bookingDate)}</p>
                                    <p><strong>Phương thức:</strong> {booking.method}</p>
                                    <p><strong>Mua kit:</strong> {booking.buyKit ? 'Có' : 'Không'}</p>
                                    <p><strong>Thanh toán:</strong> {booking.paymentStatus}</p>
                                    <p><strong>Thời gian lấy mẫu:</strong> {booking.time || 'Chưa có'}</p>
                                    <p><strong>Địa điểm:</strong> {booking.location || 'Chưa có'}</p>
                                    <p><strong>Ngày mong muốn:</strong> {formatDate(booking.preferredDate)}</p>
                                    <p><strong>Kết quả:</strong> {booking.result ?? 'Chưa có'}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingHistory;
