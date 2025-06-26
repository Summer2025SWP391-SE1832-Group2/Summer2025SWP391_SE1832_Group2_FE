import { Button } from '@/components/ui/button';
import { Receipt, RefreshCw } from 'lucide-react';

type TransactionHeaderProps = {
  onRefresh: () => void;
};

export const TransactionHeader = ({ onRefresh }: TransactionHeaderProps) => (
  <div className='text-center space-y-6 mb-8'>
    <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg'>
      <Receipt className='h-8 w-8 text-white' />
    </div>

    <div className='space-y-2'>
      <h1 className='text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'>
        Lịch sử giao dịch
      </h1>
      <p className='text-lg text-slate-600 max-w-2xl mx-auto'>
        Theo dõi và quản lý tất cả các giao dịch thanh toán của bạn
      </p>
    </div>

    <Button
      onClick={onRefresh}
      variant='outline'
      size='lg'
      className='bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300'
    >
      <RefreshCw className='h-4 w-4 mr-2' />
      Làm mới
    </Button>
  </div>
);
