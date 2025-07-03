import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface BookingWarningDialogProps {
  showWarningDialog: boolean;
  setShowWarningDialog: (show: boolean) => void;
  handleCancelBooking: () => void;
  handleConfirmBooking: () => void;
  isPending: boolean;
}

export function BookingWarningDialog({
  showWarningDialog,
  setShowWarningDialog,
  handleCancelBooking,
  handleConfirmBooking,
  isPending,
}: BookingWarningDialogProps) {
  return (
    <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-amber-500' />
            Cảnh báo đã có lịch đặt gần đây
          </DialogTitle>
          <DialogDescription className='text-left'>
            Bạn đã từng đặt một lịch xét nghiệm gần đây. Việc tiếp tục đặt thêm lịch mới có thể dẫn
            đến dư thừa hoặc gây nhầm lẫn.
            <br />
            <br />
            Bạn có chắc chắn muốn tiếp tục đặt lịch mới không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex flex-col-reverse sm:flex-row gap-2'>
          <Button variant='outline' onClick={handleCancelBooking}>
            Hủy bỏ
          </Button>
          <Button onClick={handleConfirmBooking} disabled={isPending}>
            {isPending ? 'Đang xử lý...' : 'Tiếp tục đặt lịch'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
