import BrandLogo from '@/components/common/brand-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth';
import { paths } from '@/utils/constant/path';
import { ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between'>
        <Link to={paths.home}>
          <BrandLogo />
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
        </nav>

        <div className='flex items-center space-x-4'>
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='flex items-center gap-2'>
                  <Avatar>
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className='hidden lg:block text-sm font-medium'>{user.fullName}</span>
                  <ChevronDown className='h-4 w-4' />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuItem className='flex flex-col items-start'>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant='ghost' asChild>
                <Link to={paths.login}>Đăng nhập</Link>
              </Button>
              <Button asChild>
                <Link to={paths.register}>Đăng ký</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
