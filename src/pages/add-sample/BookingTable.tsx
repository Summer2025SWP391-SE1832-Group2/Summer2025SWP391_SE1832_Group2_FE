import React, { useState, useMemo } from "react";
import type { NewSample, Sample } from "@/types/sample";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { paths } from "@/utils/constant/path";
import SampleForm from "./SampleForm";
import SampleList from "./SampleList";
import type { Booking } from "@/types/booking";

type BookingTableProps = {
  bookings: Booking[];
  sampleMap: Record<number, Sample[]>;
  expanded: number | null;
  openDialogId: number | null;
  onToggleSamples: (bookingId: number) => void;
  onOpenDialog: (bookingId: number | null) => void;
  onCreateSample: (bookingId: number, data: Omit<NewSample, 'bookingId'>) => void;
  onDeleteSample: (bookingId: number, sampleId: number) => void;
  onEditSample: (bookingId: number, sample: Sample) => void;
  getSchedule: (bookingId: number) => Promise<any>;
  currentUserId: string;
};

const ITEMS_PER_PAGE = 8;

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  sampleMap,
  expanded,
  openDialogId,
  onToggleSamples,
  onOpenDialog,
  onCreateSample,
  onDeleteSample,
  onEditSample,
  getSchedule,
  currentUserId
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return bookings.slice(start, start + ITEMS_PER_PAGE);
  }, [bookings, currentPage]);

  return (
    <div>
      {bookings.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-10">
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
                <TableHead className="pl-50 text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBookings.map(b => (
                <React.Fragment key={b.bookingId}>
                  <TableRow>
                    <TableCell>{b.bookingId}</TableCell>
                    <TableCell>{b.fullName}</TableCell>
                    <TableCell>{b.status}</TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button size="sm" onClick={() => onToggleSamples(b.bookingId)}>
                        {expanded === b.bookingId ? "Ẩn mẫu" : "Xem mẫu"}
                      </Button>

                      <Dialog
                        open={openDialogId === b.bookingId}
                        onOpenChange={(open) => onOpenDialog(open ? b.bookingId : null)}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm">Thêm mẫu</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Thêm mẫu cho Booking #{b.bookingId}</DialogTitle>
                          </DialogHeader>
                          <SampleForm
                            bookingId={b.bookingId}
                            onSubmit={onCreateSample}
                            defaultCollectedBy={currentUserId}
                            loadSchedule={() => getSchedule(b.bookingId)}
                          />
                        </DialogContent>
                      </Dialog>

                      <Link to={paths.addResult.replace(":id", b.bookingId.toString())}>
                        <Button size="sm">Nhập kết quả</Button>
                      </Link>
                    </TableCell>
                  </TableRow>

                  {expanded === b.bookingId && (
                    <TableRow>
                      <TableCell colSpan={4} className="bg-gray-50">
                        <SampleList
                          samples={sampleMap[b.bookingId] || []}
                          onDelete={(sampleId) => onDeleteSample(b.bookingId, sampleId)}
                          onEdit={(sample) => onEditSample(b.bookingId, sample)}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          {bookings.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Trước
              </Button>
              <span>
                Trang {currentPage} / {totalPages || 1}
              </span>
              <Button
                size="sm"
                variant="outline"
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
