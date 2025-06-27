import React, { useEffect, useState } from 'react';
import { getAllBookings } from '@/services/booking_service';
import { Button } from '@/components/ui/button';
import type { Booking } from '@/types/booking';
import { Link } from 'react-router-dom';
import { paths } from '@/utils/constant/path';

const BookingListPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const getAddResultPath = (id: number) =>
    paths.addResult.replace(':id', id.toString());

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getAllBookings();
      setBookings([...data].reverse()); 
    };
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách Booking</h1>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.bookingId} className="bg-gray-100 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Booking #{booking.bookingId}</p>
                <p className="text-sm text-gray-600">Trạng thái: {booking.status}</p>
                <p className="text-sm text-gray-600">Phương thức: {booking.method}</p>
              </div>
              <Link to={getAddResultPath(booking.bookingId)}>
                <Button>Nhập kết quả</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingListPage;
