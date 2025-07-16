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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [employees, setEmployees] = useState<User[]>([]);
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredBookings = bookings.filter((b) => {
    const statusMatch =
      filterStatus === '' || filterStatus === 'All'
        ? true
        : filterStatus === 'NoCollector'
        ? b.sampleCollectionSchedules.some((scs) => scs.collectorId == null)
        : b.status === filterStatus;
    return statusMatch && b.bookingId.toString().includes(search);
  });

  // const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings
    .slice()
    .reverse()
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllBookingSchedule();
        const filter = data.filter((booking) => booking.paymentStatus === 'Paid');
        setBookings(filter);
        console.log('Fetched bookings:', data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    fetchData();
  }, []);

  const handleBookingClick = async (booking: Booking) => {
    setSelectedBooking(booking);
    setAssignedEmployee('');
    const scheduleId = booking.sampleCollectionSchedules?.[0]?.scheduleId;
    if (!scheduleId) {
      setEmployees([]);
      return;
    }
    try {
      const staffList = await getStaffForSchedule(booking.bookingId);
      setEmployees(staffList);
    } catch (error) {
      console.error('Failed to fetch staff for schedule:', error);
      setEmployees([]);
    }
  };

  const handleSaveAssignment = async () => {
    if (!selectedBooking || !assignedEmployee) {
      alert('Please select a booking and an employee.');
      return;
    }
    const scheduleId = selectedBooking.sampleCollectionSchedules?.[0]?.scheduleId;
    const staffId = parseInt(assignedEmployee);
    if (!scheduleId || !staffId) {
      alert('Missing schedule or staff ID.');
      return;
    }
    try {
      await AssignStaffForSchedule(scheduleId, staffId);
      alert('Staff assigned successfully!');
      setSelectedBooking(null);
      const updatedBookings = await getAllBookingSchedule();
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Assignment failed:', error);
      alert('Failed to assign staff.');
    }
  };
  const assignedBookings = paginatedBookings.filter(
    (b) => b.sampleCollectionSchedules[0]?.collectorId !== null,
  );
  const unassignedBookings = paginatedBookings.filter(
    (b) => b.sampleCollectionSchedules[0]?.collectorId === null,
  );
  const isPastCollectionDate = (dateStr?: string) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
  };

  return (
    <div className='max-w-7xl mx-auto p-6 space-y-6'>
      <div className='flex justify-between items-center gap-4'>
        <Input
          placeholder='Search by Booking ID'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className='w-1/2'
        />
        <Select
          value={filterStatus}
          onValueChange={(value) => {
            setFilterStatus(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='All'>All</SelectItem>
            <SelectItem value='Pending'>Pending</SelectItem>
            <SelectItem value='Confirmed'>Confirmed</SelectItem>
            <SelectItem value='NoCollector'>No Collector</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Bảng đã phân công */}
        <div>
          <h2 className='text-lg font-semibold mb-2'>Đã phân công</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Thanh Toán</TableHead>
                <TableHead>Người Lấy Mẫu</TableHead>
                <TableHead>Ngày Lấy Mẫu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedBookings.map((booking) => (
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

        {/* Bảng chưa phân công */}
        <div>
          <h2 className='text-lg font-semibold mb-2'>Chưa phân công</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Thanh Toán</TableHead>
                <TableHead>Người Lấy Mẫu</TableHead>
                <TableHead>Ngày Lấy Mẫu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unassignedBookings.map((booking) => (
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

      {/* <Pagination className='mt-4'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href='#'
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.max(prev - 1, 1));
              }}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href='#'
                isActive={index + 1 === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(index + 1);
                }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href='#'
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className='!w-full !max-w-[95vw] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Chi tiết</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700'>
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
                    <strong>Thanh toán :</strong> {selectedBooking.paymentStatus}
                  </div>
                  <div>
                    <strong>Vị trí:</strong>{' '}
                    {selectedBooking.sampleCollectionSchedules[0]?.location || 'N/A'}
                  </div>
                </div>
              </div>

              <div className='border rounded-xl p-4 bg-gray-50'>
                <p className='font-semibold mb-2'>Thời gian</p>
                <div className='space-y-1'>
                  <div>
                    <strong>Ngày đặt:</strong>{' '}
                    {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Ngày thu mẫu:</strong>{' '}
                    {selectedBooking.sampleCollectionSchedules[0]
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

                {isPastCollectionDate(
                  selectedBooking.sampleCollectionSchedules[0]?.collectionDate,
                ) ? (
                  <p className='italic text-gray-500 mt-1'>Đã quá hạn – không thể phân công</p>
                ) : (
                  <Select value={assignedEmployee} onValueChange={setAssignedEmployee}>
                    <SelectTrigger className='w-full mt-1'>
                      <SelectValue placeholder='Chọn nhân viên' />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.length === 0 && (
                        <SelectItem value='NULL' disabled>
                          Không có nhân viên nào
                        </SelectItem>
                      )}
                      {employees
                        .filter((emp) => emp.userId != null)
                        .map((emp) => (
                          <SelectItem key={emp.userId} value={emp.userId.toString()}>
                            {emp.fullName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}

          <div className='flex justify-end gap-3 mt-6'>
            <Button
              className='px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition'
              onClick={handleSaveAssignment}
            >
              Lưu thay đổi
            </Button>
            <Button
              className='px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition'
              onClick={() => setSelectedBooking(null)}
            >
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
