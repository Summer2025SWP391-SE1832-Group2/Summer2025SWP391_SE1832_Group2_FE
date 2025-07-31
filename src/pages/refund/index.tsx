import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getBookingByOrderCode, refund } from '@/services/booking_service';
import { Badge } from '@/components/ui/badge';
import type { Booking } from '@/types/booking';

const RefundPage = () => {
  const [orderCode, setOrderCode] = useState<number | undefined>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFetchBooking = async () => {
    if (!orderCode) return;

    setLoading(true);
    setBooking(null);
    setError('');
    try {
      const data = await getBookingByOrderCode(orderCode);
      if (data) {
        setBooking(data);
      } else {
        setError('Không tìm thấy đơn hàng với mã này.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tìm đơn hàng.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (confirmText !== 'XÁC NHẬN') return;

    setIsSubmitting(true);
    setError('');
    try {
      await refund(orderCode!);
      setBooking(null);
      setOrderCode(undefined);
      setConfirmText('');
      alert('Hoàn tiền thành công!');
    } catch (err) {
      setError('Hoàn tiền thất bại.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 space-y-4'>
      <h2 className='text-2xl font-semibold mb-4'>Xác nhận hoàn tiền</h2>

      <div className='space-y-2'>
        <label>Mã hoàn tiền (orderCode):</label>
        <div className='flex gap-2'>
          <Input
            type='number'
            value={orderCode ?? ''}
            onChange={(e) => setOrderCode(Number(e.target.value))}
            placeholder='Nhập mã hoàn tiền'
          />
          <Button onClick={handleFetchBooking} disabled={loading}>
            {loading ? 'Đang tìm...' : 'Tìm'}
          </Button>
        </div>
        {error && <p className='text-red-600 text-sm'>{error}</p>}
      </div>

      {booking && (
        <div className='border rounded-md p-4 bg-gray-50'>
          <h3 className='text-lg font-semibold mb-2'>Thông tin đơn hàng</h3>
          <p>
            <strong>Mã đơn:</strong> #{booking.bookingId}
          </p>
          <p>
            <strong>Dịch vụ:</strong> {booking.serviceName}
          </p>
          <p>
            <strong>Trạng thái:</strong>
            <Badge className='ml-1'>{booking.status}</Badge>
          </p>
          <p>
            <strong>Ngày đặt:</strong> {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
          </p>
          <p>
            <strong>Phương thức:</strong> {booking.method}
          </p>
        </div>
      )}

      {booking && (
        <div className='space-y-2 pt-4'>
          <label>Xác nhận đã nhận tiền (nhập: "XÁC NHẬN"):</label>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder='Nhập XÁC NHẬN '
          />
          <Button
            onClick={handleRefund}
            disabled={isSubmitting || confirmText !== 'XÁC NHẬN'}
            className='bg-green-600 hover:bg-green-700'
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận hoàn tiền'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RefundPage;
