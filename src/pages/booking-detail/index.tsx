import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getBookingById } from '@/services/booking_service';
import type { Booking } from '@/types/booking';
import { Skeleton } from '@/components/ui/skeleton';

const BookingDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const bookingId = Number(id);
    console.log('params:', useParams());
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId || isNaN(bookingId)) return;
        const fetchBooking = async () => {
            try {
                const data = await getBookingById(bookingId);
                setBooking(data);
            } catch (err) {
                console.error('Lỗi khi lấy chi tiết booking:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const formatDate = (dateStr: string) => {
        if (!dateStr || dateStr === '0001-01-01T00:00:00') return 'Chưa chọn';
        return new Date(dateStr).toLocaleString();
    };

    if (loading) {
        return <Skeleton className="w-full h-48 m-6 rounded-xl" />;
    }

    if (!booking) {
        return <p className="p-6 text-red-500">Không tìm thấy booking</p>;
    }

    return (
        <div className="p-6 space-y-3">
            <h1 className="text-2xl font-bold">Chi tiết Booking #{booking.bookingId}</h1>
            <p><strong>Ngày đặt:</strong> {formatDate(booking.bookingDate)}</p>
            <p><strong>Phương thức:</strong> {booking.method}</p>
            <p><strong>Mua kit:</strong> {booking.buyKit ? 'Có' : 'Không'}</p>
            <p><strong>Thanh toán:</strong> {booking.paymentStatus}</p>
            <p><strong>Thời gian lấy mẫu:</strong> {booking.time || 'Chưa có'}</p>
            <p><strong>Địa điểm:</strong> {booking.location || 'Chưa có'}</p>
            <p><strong>Ngày mong muốn:</strong> {formatDate(booking.preferredDate)}</p>
            <p><strong>Kết quả:</strong> {booking.result ?? 'Chưa có'}</p>
        </div>
    );
};

export default BookingDetailPage;
