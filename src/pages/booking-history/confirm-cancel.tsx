import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ConfirmCancelDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmCancelDialog = ({ open, onClose, onConfirm }: ConfirmCancelDialogProps) => {
  const [confirmationText, setConfirmationText] = useState('');

  const handleConfirm = () => {
    if (confirmationText.toLowerCase() === 'có') {
      onConfirm();
      setConfirmationText('');
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận hủy đặt lịch</DialogTitle>
        </DialogHeader>
        <p>
          Bạn có chắc chắn muốn hủy đặt lịch này? Nhập <strong>"Có"</strong> để xác nhận.
        </p>
        <Input
          placeholder='Nhập "Có" để xác nhận'
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
        />
        <div className='flex justify-end gap-2 mt-4'>
          <Button variant='outline' onClick={handleClose}>
            Đóng
          </Button>
          <Button
            variant='destructive'
            onClick={handleConfirm}
            disabled={confirmationText.toLowerCase() !== 'có'}
          >
            Xác nhận hủy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmCancelDialog;
