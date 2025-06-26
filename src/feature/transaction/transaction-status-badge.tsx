import { Badge } from '@/components/ui/badge';
import type { TransactionStatus } from '@/types/transaction';

type TransactionStatusBadgeProps = {
  status: TransactionStatus;
};

const statusStyles: Record<TransactionStatus, string> = {
  SUCCESS:
    'text-green-700 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 border-green-300 font-medium',
  PENDING:
    'text-yellow-700 bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 border-yellow-300 font-medium',
  FAILED:
    'text-red-700 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 border-red-300 font-medium',
  CANCELLED:
    'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border-gray-300 font-medium',
};

const statusText: Record<TransactionStatus, string> = {
  SUCCESS: 'Thành công',
  PENDING: 'Đang chờ',
  FAILED: 'Thất bại',
  CANCELLED: 'Đã hủy',
};

export const TransactionStatusBadge = ({ status }: TransactionStatusBadgeProps) => (
  <Badge
    className={`${statusStyles[status]} px-3 py-1 rounded-full text-xs transition-all duration-200`}
  >
    {statusText[status] ?? status}
  </Badge>
);
