import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/helper';
import type { Transaction } from '@/types/transaction';
import { TrendingUp, Clock, Wallet, BarChart3 } from 'lucide-react';

type TransactionStatsProps = {
  transactions: Transaction[];
};

export const TransactionStats = ({ transactions }: TransactionStatsProps) => {
  const stats = {
    total: transactions.length,
    successful: transactions.filter((t) => t.status === 'Đã thanh toán').length,
    pending: transactions.filter((t) => t.status === 'Chưa thanh toán').length,
    totalAmount: transactions
      .filter((t) => t.status === 'Đã thanh toán')
      .reduce((sum, t) => sum + t.price, 0),
  };

  const statCards = [
    {
      label: 'Tổng giao dịch',
      value: stats.total.toString(),
      icon: BarChart3,
      color: 'bg-blue-50 text-blue-600',
      bgColor: 'bg-blue-500',
    },
    {
      label: 'Thành công',
      value: stats.successful.toString(),
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
      bgColor: 'bg-green-500',
    },
    {
      label: 'Đang xử lý',
      value: stats.pending.toString(),
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      bgColor: 'bg-amber-500',
    },
    {
      label: 'Tổng thanh toán',
      value: formatCurrency(stats.totalAmount),
      icon: Wallet,
      color: 'bg-purple-50 text-purple-600',
      bgColor: 'bg-purple-500',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {statCards.map((stat, index) => (
        <Card
          key={index}
          className='border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300'
        >
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-600 mb-1'>{stat.label}</p>
                <p className='text-2xl font-bold text-slate-800'>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className='h-6 w-6' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
