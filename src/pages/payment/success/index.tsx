import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { paths } from '@/utils/constant/path';
import confetti from 'canvas-confetti';
import { CheckCircle2, ChevronRight, FileText, Home, ListChecks } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const orderDetails = {
    orderNumber: '0000000',
    serviceName: 'DNA Testing Service',
    amount: '1,000,000 VND',
    date: new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  // Run confetti animation on page load
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#00C49A', '#FFBB28', '#0088FE'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#00C49A', '#FFBB28', '#0088FE'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='container max-w-6xl mx-auto py-16 px-4 sm:px-6 flex flex-col items-center'>
      {/* Success Message */}
      <div className='text-center mb-12'>
        <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6'>
          <CheckCircle2 className='w-12 h-12 text-green-600' />
        </div>
        <h1 className='text-3xl md:text-4xl font-bold mb-4'>Thanh toán thành công!</h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          Cảm ơn bạn đã đặt lịch dịch vụ xét nghiệm. Thông tin chi tiết về đơn hàng của bạn đã được
          gửi qua email.
        </p>
      </div>

      {/* Order Details Card */}
      <Card className='w-full max-w-2xl mb-12 overflow-hidden shadow-lg border-0 bg-white dark:bg-gray-800'>
        <div className='bg-primary/10 px-6 py-4 border-b border-border/30'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <FileText className='h-5 w-5 text-primary' />
              <h2 className='text-lg font-medium'>Chi tiết đơn hàng</h2>
            </div>
            <span className='text-sm text-muted-foreground'>{orderDetails.date}</span>
          </div>
        </div>

        <CardContent className='p-6'>
          <div className='space-y-4'>
            <div className='flex justify-between py-2 border-b border-border/30'>
              <span className='text-muted-foreground'>Dịch vụ:</span>
              <span className='font-medium'>{orderDetails.serviceName}</span>
            </div>

            <div className='flex justify-between py-2 border-b border-border/30'>
              <span className='text-muted-foreground'>Mã đơn hàng:</span>
              <span className='font-medium'>#{orderDetails.orderNumber}</span>
            </div>

            <div className='flex justify-between py-2'>
              <span className='text-muted-foreground'>Tổng thanh toán:</span>
              <span className='font-bold text-lg text-primary'>{orderDetails.amount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className='flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl'>
        <Button asChild variant='outline' size='lg' className='w-full sm:w-auto'>
          <Link to={paths.home} className='flex items-center justify-center gap-2'>
            <Home className='w-4 h-4' />
            <span>Về trang chủ</span>
          </Link>
        </Button>

        <Button asChild size='lg' className='w-full sm:w-auto'>
          <Link to={paths.bookingHistory} className='flex items-center justify-center gap-2'>
            <ListChecks className='w-4 h-4' />
            <span>Xem lịch hẹn</span>
            <ChevronRight className='w-4 h-4 ml-1' />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
