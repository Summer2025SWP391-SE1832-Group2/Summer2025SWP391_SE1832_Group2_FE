import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllBookings } from '@/services/booking_service';
import type { Booking } from '@/types/booking';
import { useEffect, useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import ShippingStep from './ShippingStep';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Shipping } from '@/types/shipping';
import { getListShippingByBookingId, updateShipping } from '@/services/shipping_service';

const ShippingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [shippingList, setShippingList] = useState<Shipping[]>([]);

  const handleOpenDialog = async (booking: Booking) => {
    setSelectedBooking(booking);
    try {
      const result = await getListShippingByBookingId(booking.bookingId);
      setShippingList(result);
      setOpenDialog(true);
    } catch (err) {
      console.error('Failed to fetch shipping list:', err);
    }
  };
  const handleConfirmShipping = async () => {
    if (!shippingList[0]) return;

    const updatedShipping: Shipping = {
      ...shippingList[0],
      shippingId: 0,
      status: 'Đã giao hàng',
      updateAt: new Date().toISOString(),
    };

    try {
      await updateShipping(updatedShipping);
      alert('Đã cập nhật trạng thái giao hàng!');
      const refreshed = await getListShippingByBookingId(updatedShipping.bookingId);
      setShippingList(refreshed);
    } catch (error) {
      console.error('Failed to update shipping:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };

  useEffect(() => {
    const fetchAssignedBookings = async () => {
      try {
        const response = await getAllBookings();
        const filtered = response.filter((booking) => booking.method === 'TU_THU_MAU');

        setBookings(filtered);
      } catch (error) {
        console.error('Error fetching assigned bookings:', error);
      }
    };

    fetchAssignedBookings();
  }, []);

  const totalPages = Math.ceil(bookings.length / limit);
  const paginatedBookings = bookings.slice((page - 1) * limit, page * limit);

  return (
    <div>
      <h2 className='text-lg font-semibold mb-2'>Đã phân công</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trạng Thái</TableHead>
            <TableHead>Thanh Toán</TableHead>
            <TableHead>Ngày Giao Kit</TableHead>
            <TableHead>Xác nhận</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBookings.map((booking) => (
            <TableRow key={booking.bookingId} className='cursor-pointer hover:bg-gray-100'>
              <TableCell>{booking.status}</TableCell>
              <TableCell>{booking.paymentStatus}</TableCell>
              <TableCell>{booking.collectionDate}</TableCell>
              <TableCell>
                <button
                  onClick={() => handleOpenDialog(booking)}
                  className='text-sm px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90'
                >
                  Xác nhận giao hàng
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className='mt-4'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setPage((prev) => Math.max(prev - 1, 1))} />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <PaginationItem key={idx}>
              <PaginationLink isActive={page === idx + 1} onClick={() => setPage(idx + 1)}>
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tiến trình giao hàng</DialogTitle>
          </DialogHeader>

          <ShippingStep shippingList={shippingList} />

          <DialogFooter className='flex justify-between items-center'>
            <Button variant='secondary' onClick={() => setOpenDialog(false)}>
              Đóng
            </Button>
            <Button
              onClick={handleConfirmShipping}
              disabled={shippingList.length >1}
            >
              Xác nhận giao hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShippingPage;
