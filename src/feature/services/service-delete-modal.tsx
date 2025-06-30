import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ServiceResponse } from '@/types/services';

type ServiceDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  service: ServiceResponse | null;
  isDeleting: boolean;
};

export const ServiceDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  service,
  isDeleting,
}: ServiceDeleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Xóa dịch vụ</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa dịch vụ "{service?.name}" không? Hành động này không thể hoàn
            tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={onClose} disabled={isDeleting}>
            Hủy
          </Button>
          <Button variant='destructive' onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
