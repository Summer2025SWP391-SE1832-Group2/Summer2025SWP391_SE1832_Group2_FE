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
import AssignStaffDialog from './dialog-assign-staff';

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
        setBookings(data);
        // const paidBookings = data.filter((b) => b.paymentStatus === 'Đã thanh toán');
        // setBookings(paidBookings);
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
                  <TableCell>
                    {booking.sampleCollectionSchedules[0]?.collectorName || ' '}
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
      <AssignStaffDialog
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        employees={employees}
        assignedEmployee={assignedEmployee}
        setAssignedEmployee={setAssignedEmployee}
        onSave={handleSaveAssignment}
      />
    </div>
  );
}
