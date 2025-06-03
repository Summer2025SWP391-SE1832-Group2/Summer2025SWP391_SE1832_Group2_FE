import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { paths } from '@/utils/constant/path';

const Header = () => {
  const location = useLocation();

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between'>
        <Link to={paths.home} className='flex items-center space-x-2'>
          <div className='h-8 w-8 rounded bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>DNA</span>
          </div>
          <span className='text-xl font-bold'>BloodLine</span>
        </Link>

        <nav className='hidden md:flex items-center space-x-6'>
          <Link
            to={paths.home}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === paths.home ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Trang chủ
          </Link>
          <a
            href='#services'
            className='text-sm font-medium text-muted-foreground hover:text-primary'
          >
            Dịch vụ
          </a>
          <a href='#about' className='text-sm font-medium text-muted-foreground hover:text-primary'>
            Về chúng tôi
          </a>
          <a
            href='#contact'
            className='text-sm font-medium text-muted-foreground hover:text-primary'
          >
            Liên hệ
          </a>
          <a
            href='/blog-type'
            className='text-sm font-medium text-muted-foreground hover:text-primary'
          >
            Blog
          </a>
        </nav>

        <div className='flex items-center space-x-4'>
          <Button variant='ghost' asChild>
            <Link to={paths.login}>Đăng nhập</Link>
          </Button>
          <Button asChild>
            <Link to={paths.register}>Đăng ký</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
