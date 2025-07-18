import React, { useState, useMemo } from 'react';
import type { Sample } from '@/types/sample';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { paths } from '@/utils/constant/path';
import SampleList from './SampleList';
import type { Booking } from '@/types/booking';
import { useAuthStore } from '@/stores/auth';

type BookingTableProps = {
  bookings: Booking[];
  sampleMap: Record<number, Sample[]>;
  expanded: number | null;
  onToggleSamples: (bookingId: number) => void;
  onReloadSamples: (bookingId: number) => Promise<void>;
};

const ITEMS_PER_PAGE = 8;

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  sampleMap,
  expanded,
  onToggleSamples,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return bookings.slice(start, start + ITEMS_PER_PAGE);
  }, [bookings, currentPage]);
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div>
      {bookings.length === 0 ? (
        <div className='text-center text-sm text-muted-foreground py-10'>
          Không có dữ liệu đặt lịch.
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className='text-right'>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBookings.map((b) => (
                <React.Fragment key={b.bookingId}>
                  <TableRow>
                    <TableCell>{b.bookingId}</TableCell>
                    <TableCell>{b.fullName}</TableCell>
                    <TableCell>{b.status}</TableCell>
                    <TableCell className='space-x-2 text-right'>
                      {user?.role !== 'TestStaff' && (
                        <Button size='sm' onClick={() => onToggleSamples(b.bookingId)}>
                          {expanded === b.bookingId ? 'Ẩn mẫu' : 'Xem mẫu'}
                        </Button>
                      )}

                      {user?.role === 'TestStaff' && b.status !== 'Đang chờ xử lý' && (
                        <Link to={paths.staff.addResult.replace(':id', b.bookingId.toString())}>
                          <Button size='sm'>Nhập kết quả</Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>

                  {expanded === b.bookingId && (
                    <TableRow>
                      <TableCell colSpan={4} className='bg-gray-50'>
                        <SampleList
                          samples={sampleMap[b.bookingId] || []}
                          onReload={() => onReloadSamples(b.bookingId)}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          {bookings.length > 0 && totalPages > 1 && (
            <div className='flex justify-center items-center gap-2 mt-4'>
              <Button
                size='sm'
                variant='outline'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Trước
              </Button>
              <span>
                Trang {currentPage} / {totalPages || 1}
              </span>
              <Button
                size='sm'
                variant='outline'
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingTable;
