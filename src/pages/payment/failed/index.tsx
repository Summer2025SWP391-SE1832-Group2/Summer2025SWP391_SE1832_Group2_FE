import { Button } from '@/components/ui/button';
import { paths } from '@/utils/constant/path';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentFailedPage = () => {
  return (
    <div className='container max-w-6xl mx-auto py-16 px-4 sm:px-6 flex flex-col items-center'>
      {/* Error Message */}
      <div className='text-center mb-12'>
        <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6'>
          <AlertTriangle className='w-12 h-12 text-red-600' />
        </div>
        <h1 className='text-3xl md:text-4xl font-bold mb-4'>Thanh toán không thành công</h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          Rất tiếc, chúng tôi không thể xử lý thanh toán của bạn. Vui lòng kiểm tra thông tin thanh
          toán và thử lại.
        </p>
      </div>

      {/* Error Details Card */}

      {/* Action Buttons */}
      <Button asChild variant='outline' size='lg' className='w-full sm:w-auto'>
        <Link to={paths.home} className='flex items-center justify-center gap-2'>
          <ArrowLeft className='w-4 h-4' />
          <span>Về trang chủ</span>
        </Link>
      </Button>
    </div>
  );
};

export default PaymentFailedPage;
