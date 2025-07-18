import { Button } from '@/components/ui/button';
import { paths } from '@/utils/constant/path';
import confetti from 'canvas-confetti';
import { CheckCircle2, Home } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccessPage = () => {
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

      {/* Action Buttons */}
      <div className='flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl'>
        <Button asChild variant='outline' size='lg' className='w-full sm:w-auto'>
          <Link to={paths.home} className='flex items-center justify-center gap-2'>
            <Home className='w-4 h-4' />
            <span>Về trang chủ</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
