import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import type { Booking } from '@/types/booking';
import type { User } from '@/types/user';

import {
  getAllBookingSchedule,
  getStaffForSchedule,
  AssignStaffForSchedule,
} from '@/services/booking_service';

export default function AppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [employees, setEmployees] = useState<User[]>([]);
  const [assignedEmployee, setAssignedEmployee] = useState('');

  // Fetch booking data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookingSchedule();
        const paidBookings = data.filter((b) => b.paymentStatus === 'Đã thanh toán');
        setBookings(paidBookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  // Helpers
  const getFilteredBookings = () =>
    bookings
      .filter((b) => b.bookingId.toString().includes(search))
      .slice()
      .reverse();

  const getAssignedBookings = () =>
    getFilteredBookings().filter((b) => b.sampleCollectionSchedules[0]?.collectorId !== null);

  const getUnassignedBookings = () =>
    getFilteredBookings().filter((b) => b.sampleCollectionSchedules[0]?.collectorId === null);

  const isPastCollectionDate = (dateStr?: string) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
  };

  const handleBookingClick = async (booking: Booking) => {
    setSelectedBooking(booking);
    setAssignedEmployee('');
    const scheduleId = booking.sampleCollectionSchedules?.[0]?.scheduleId;
    if (!scheduleId) return setEmployees([]);
    try {
      const staffList = await getStaffForSchedule(booking.bookingId);
      setEmployees(staffList);
    } catch (error) {
      console.error('Failed to fetch staff for schedule:', error);
      setEmployees([]);
    }
  };

  const handleSaveAssignment = async () => {
    if (!selectedBooking || !assignedEmployee) return alert('Vui lòng chọn nhân viên.');

    const scheduleId = selectedBooking.sampleCollectionSchedules?.[0]?.scheduleId;
    const staffId = parseInt(assignedEmployee);

    if (!scheduleId || !staffId) return alert('Thiếu thông tin phân công.');

    try {
      await AssignStaffForSchedule(scheduleId, staffId);
      alert('Phân công thành công!');
      setSelectedBooking(null);
      const updated = await getAllBookingSchedule();
      setBookings(updated.filter((b) => b.paymentStatus === 'Đã thanh toán'));
    } catch (error) {
      console.error('Phân công thất bại:', error);
      alert('Có lỗi xảy ra khi phân công.');
    }
  };

  return (
    <div className='max-w-7xl mx-auto p-6 space-y-6'>
      {/* Search */}
      <div className='flex justify-between items-center gap-4'>
        <Input
          placeholder='Tìm kiếm theo mã đơn'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full'
        />
      </div>

      {/* Tables */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Assigned */}
        <div>
          <h2 className='text-lg font-semibold mb-2'>Đã phân công</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Người lấy mẫu</TableHead>
                <TableHead>Ngày lấy mẫu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getAssignedBookings().map((booking) => (
                <TableRow
                  key={booking.bookingId}
                  onClick={() => handleBookingClick(booking)}
                  className='cursor-pointer hover:bg-gray-100'
                >
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>{booking.paymentStatus}</TableCell>
                  <TableCell>{booking.sampleCollectionSchedules[0]?.collectorName}</TableCell>
                  <TableCell>
                    {new Date(
                      booking.sampleCollectionSchedules[0]?.collectionDate,
                    ).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Unassigned */}
        <div>
          <h2 className='text-lg font-semibold mb-2'>Chưa phân công</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Người lấy mẫu</TableHead>
                <TableHead>Ngày lấy mẫu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getUnassignedBookings().map((booking) => (
                <TableRow
                  key={booking.bookingId}
                  onClick={() => handleBookingClick(booking)}
                  className='cursor-pointer hover:bg-gray-100'
                >
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>{booking.paymentStatus}</TableCell>
                  <TableCell>
                    {booking.sampleCollectionSchedules[0]?.collectorName || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      booking.sampleCollectionSchedules[0]?.collectionDate,
                    ).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className='!w-full !max-w-[95vw] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Chi tiết đơn</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700'>
              {/* Booking Info */}
              <div className='border rounded-xl p-4 bg-gray-50'>
                <p className='font-semibold mb-2'>Chi tiết</p>
                <div className='space-y-1'>
                  <div>
                    <strong>Mã đơn:</strong> {selectedBooking.bookingId}
                  </div>
                  <div>
                    <strong>Người đặt:</strong> {selectedBooking.userId}
                  </div>
                  <div>
                    <strong>Thanh toán:</strong> {selectedBooking.paymentStatus}
                  </div>
                  <div>
                    <strong>Vị trí:</strong>{' '}
                    {selectedBooking.sampleCollectionSchedules[0]?.location || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Time Info */}
              <div className='border rounded-xl p-4 bg-gray-50'>
                <p className='font-semibold mb-2'>Thời gian</p>
                <div className='space-y-1'>
                  <div>
                    <strong>Ngày đặt:</strong>{' '}
                    {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Ngày thu mẫu:</strong>{' '}
                    {selectedBooking.sampleCollectionSchedules[0]?.collectionDate
                      ? new Date(
                          selectedBooking.sampleCollectionSchedules[0].collectionDate,
                        ).toLocaleString()
                      : 'N/A'}
                  </div>
                  <div>
                    <strong>Thời gian:</strong>{' '}
                    {selectedBooking.sampleCollectionSchedules[0]?.time || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div className='border rounded-xl p-4 bg-gray-50'>
                <p className='font-semibold mb-2'>Trạng thái</p>
                <div className='space-y-1'>
                  <div>
                    <strong>Trạng thái:</strong> {selectedBooking.status}
                  </div>
                  <div>
                    <strong>Trạng thái mẫu:</strong>{' '}
                    {selectedBooking.sampleCollectionSchedules[0]?.status || 'N/A'}
                  </div>
                </div>
              </div>

              <div className='border rounded-xl p-4 bg-gray-50'>
                <p className='font-semibold mb-2'>Phân công nhân viên</p>

                {selectedBooking.sampleCollectionSchedules[0]?.collectorId ? (
                  <p className='mt-1'>
                    Đã phân công cho:{' '}
                    <span className='font-medium'>
                      {selectedBooking.sampleCollectionSchedules[0]?.collectorName}
                    </span>
                  </p>
                ) : isPastCollectionDate(
                    selectedBooking.sampleCollectionSchedules[0]?.collectionDate,
                  ) ? (
                  <p className='italic text-gray-500 mt-1'>Đã quá hạn – không thể phân công</p>
                ) : (
                  <Select value={assignedEmployee} onValueChange={setAssignedEmployee}>
                    <SelectTrigger className='w-full mt-1'>
                      <SelectValue placeholder='Chọn nhân viên' />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.length === 0 ? (
                        <SelectItem value='NULL' disabled>
                          Không có nhân viên nào
                        </SelectItem>
                      ) : (
                        employees.map((emp) => (
                          <SelectItem key={emp.userId} value={emp.userId.toString()}>
                            {emp.fullName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}

         
          {!selectedBooking?.sampleCollectionSchedules[0]?.collectorId &&
            !isPastCollectionDate(selectedBooking?.sampleCollectionSchedules[0]?.collectionDate) && (
              <div className='flex justify-end gap-3 mt-6'>
                <Button className='bg-green-600 text-white' onClick={handleSaveAssignment}>
                  Lưu thay đổi
                </Button>
                <Button variant='secondary' onClick={() => setSelectedBooking(null)}>
                  Hủy
                </Button>
              </div>
            )}

          {/* Nút Hủy khi không được phép phân công */}
          {(selectedBooking?.sampleCollectionSchedules[0]?.collectorId ||
            isPastCollectionDate(selectedBooking?.sampleCollectionSchedules[0]?.collectionDate)) && (
            <div className='flex justify-end gap-3 mt-6'>
              <Button variant='secondary' onClick={() => setSelectedBooking(null)}>
                Đóng
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
