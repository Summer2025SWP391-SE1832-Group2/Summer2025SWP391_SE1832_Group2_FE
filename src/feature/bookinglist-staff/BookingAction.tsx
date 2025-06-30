import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { paths } from "@/utils/constant/path";

interface BookingActionProps {
  bookingId: number;
  visible: boolean;
  toggleSampleList: () => void;
  openDialogBookingId: number | null;
  setOpenDialogBookingId: (id: number | null) => void;
  renderDialogContent: () => React.ReactNode;
}

const BookingAction: React.FC<BookingActionProps> = ({
  bookingId,
  visible,
  toggleSampleList,
  openDialogBookingId,
  setOpenDialogBookingId,
  renderDialogContent,
}) => {
  const getAddResultPath = (id: number) =>
    paths.addResult.replace(":id", id.toString());

  return (
    <div className="space-x-2 text-right">
      <Button variant="black" size="sm" onClick={toggleSampleList}>
        {visible ? "Ẩn mẫu" : "Xem mẫu"}
      </Button>

      <Dialog
        open={openDialogBookingId === bookingId}
        onOpenChange={(open) => {
          setOpenDialogBookingId(open ? bookingId : null);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="black" size="sm">Thêm mẫu</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm mẫu cho Booking #{bookingId}</DialogTitle>
          </DialogHeader>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>

      <Link to={getAddResultPath(bookingId)}>
        <Button size="sm">Nhập kết quả</Button>
      </Link>
    </div>
  );
};

export default BookingAction;
