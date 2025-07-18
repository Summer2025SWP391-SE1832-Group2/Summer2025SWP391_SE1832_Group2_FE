import { Badge } from '@/components/ui/badge';
import type { TransactionStatus } from '@/types/transaction';

type TransactionStatusBadgeProps = {
  status: TransactionStatus;
};

const statusStyles: Record<TransactionStatus, string> = {
  'Đã thanh toán':
    'text-green-700 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 border-green-300 font-medium',
  'Chưa thanh toán':
    'text-red-700 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 border-red-300 font-medium',
};

const statusText: Record<TransactionStatus, string> = {
  'Đã thanh toán': 'Đã thanh toán',
  'Chưa thanh toán': 'Chưa thanh toán',
};

export const TransactionStatusBadge = ({ status }: TransactionStatusBadgeProps) => (
  <Badge
    className={`${statusStyles[status]} px-3 py-1 rounded-full text-xs transition-all duration-200`}
  >
    {statusText[status] ?? status}
  </Badge>
);
