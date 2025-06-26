import { formatCurrency } from '@/utils/helper';

type BookingPriceSummaryProps = {
  price: number;
};

export const BookingPriceSummary = ({ price }: BookingPriceSummaryProps) => (
  <div className='bg-primary/5 dark:bg-primary/10 p-4 rounded-lg'>
    <div className='flex items-center justify-between mb-4'>
      <span className='text-muted-foreground'>Giá dịch vụ:</span>
      <span>{formatCurrency(price)}</span>
    </div>
    <div className='flex items-center justify-between font-medium'>
      <span>Tổng cộng:</span>
      <span className='text-xl font-bold text-primary'>{formatCurrency(price)}</span>
    </div>
  </div>
);
