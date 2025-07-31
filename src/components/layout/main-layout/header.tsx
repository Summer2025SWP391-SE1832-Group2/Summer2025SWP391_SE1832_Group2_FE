import BrandLogo from '@/components/common/brand-logo';
import { EmptyState } from '@/components/common/empty_state';
import { ErrorMessage } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useService } from '@/hooks/useService';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { paths } from '@/utils/constant/path';
import { roleBadgeStyles, getRoleDisplayName } from '@/utils/role-utils';
import { ChevronDown, Clock, CreditCard, FileHeart, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const { queryServices } = useService();
  const { data: services, isLoading, error, refetch } = queryServices;

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
          <NavLink
            to={paths.home}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            Trang chủ
          </NavLink>

          <div
            className='relative'
            onMouseEnter={() => setIsServiceMenuOpen(true)}
            onMouseLeave={() => setIsServiceMenuOpen(false)}
          >
            <button className='text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1'>
              Dịch vụ
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                  isServiceMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isServiceMenuOpen && <div className='absolute top-full left-0 h-2 w-full'></div>}
            <div
              className={`absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-2 w-48 z-50 origin-top transition-all duration-300 ease-in-out ${
                isServiceMenuOpen
                  ? 'opacity-100 scale-y-100 translate-y-0'
                  : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'
              }`}
            >
              {isLoading && (
                <div className='px-4 py-2 text-sm'>
                  <Loading size={15} />
                </div>
              )}

              {error && error.message && (
                <div className='px-4 py-2 text-sm text-red-500'>
                  <ErrorMessage
                    message={error.message || 'Failed to load services'}
                    onRetry={refetch}
                  />
                </div>
              )}

              {services && services.length > 0 && (
                <div className='transition-all duration-300 delay-100'>
                  {services.map((service, index) => (
                    <Link
                      key={service.serviceId}
                      to={paths.booking(service.serviceId.toString())}
                      className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                        isServiceMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                      }`}
                      style={{
                        transitionDelay: `${index * 50}ms`,
                      }}
                      onClick={() => setIsServiceMenuOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
              {services && services.length === 0 && (
                <EmptyState
                  title='No services found'
                  description='There are no services to display at this time.'
                />
              )}
            </div>
          </div>

          <a href='#about' className='text-sm font-medium text-muted-foreground hover:text-primary'>
            Về chúng tôi
          </a>
          <a href='#' className='text-sm font-medium text-muted-foreground hover:text-primary'>
            Liên hệ
          </a>
          <Link
            to={paths.blogType}
            className='text-sm font-medium text-muted-foreground hover:text-primary'
          >
            Blog
          </Link>
          <Link
            to={paths.blogType}
            className='text-sm font-medium text-muted-foreground hover:text-primary'
          >
            Phản Hồi
          </Link>
        </nav>

        <div className='flex items-center space-x-4'>
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className='flex items-center gap-2 cursor-pointer'>
                  <Avatar>
                    <AvatarFallback>{user?.fullName?.charAt(0) ?? ''}</AvatarFallback>
                  </Avatar>
                  <div className='hidden lg:flex flex-col items-start'>
                    <span className='text-sm font-medium'>{user.fullName}</span>
                    {user?.role && (
                      <Badge
                        variant='outline'
                        className={cn('text-xs px-1.5 py-0 h-5', roleBadgeStyles[user.role])}
                      >
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className='h-4 w-4' />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end'>
                <div className='px-2 py-1.5 text-xs text-muted-foreground flex items-center gap-1.5 border-b mb-1'>
                  <Badge variant='outline' className={roleBadgeStyles[user?.role || 'Guest']}>
                    {getRoleDisplayName(user?.role || 'Guest')}
                  </Badge>
                  <span>Vai trò của bạn</span>
                </div>
                <DropdownMenuItem asChild>
                  <Link to={paths.profile}>
                    <span className='flex items-center gap-2 w-full'>
                      <User className='h-4 w-4' />
                      Hồ sơ
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={paths.bookingHistory}>
                    <span className='flex items-center gap-2 w-full'>
                      <Clock className='h-4 w-4' />
                      lịch sử đặt lịch
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={paths.transaction}>
                    <span className='flex items-center gap-2 w-full'>
                      <CreditCard className='h-4 w-4' />
                      Xem giao dịch
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={paths.blogFavorite}>
                    <span className='flex items-center gap-2 w-full'>
                      <FileHeart className='h-4 w-4' />
                      Blog yêu thích
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className='text-red-600 flex items-center gap-2 w-full'
                >
                  <LogOut className='h-4 w-4' />
                  Đăng xuất
                </DropdownMenuItem>
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
