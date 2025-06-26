import { Badge } from '@/components/ui/badge';
import type { TransactionStatus } from '@/types/transaction';
import { CheckCircle, Clock } from 'lucide-react';

type TransactionStatusBadgeProps = {
  status: TransactionStatus;
};

const statusConfig: Record<
  TransactionStatus,
  {
    style: string;
    icon: React.ReactNode;
    label: string;
  }
> = {
  'Đã thanh toán': {
    style:
      'text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border-emerald-200 shadow-sm',
    icon: <CheckCircle className='h-3 w-3' />,
    label: 'Đã thanh toán',
  },
  'Chưa thanh toán': {
    style:
      'text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-amber-200 shadow-sm',
    icon: <Clock className='h-3 w-3' />,
    label: 'Chưa thanh toán',
  },
};

export const TransactionStatusBadge = ({ status }: TransactionStatusBadgeProps) => {
  const config = statusConfig[status] || '';

  return (
    <Badge
      className={`${config.style} px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5`}
    >
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
};
