import { Bell, LogOut, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth';
import { Link, useNavigate } from 'react-router-dom';
import { paths } from '@/utils/constant/path';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { roleBadgeStyles, getRoleDisplayName } from '@/utils/role-utils';

const DashboardHeader = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(paths.login);
  };

  return (
    <header className='sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 -mb-px'>
          {/* Left: Search */}
          <div className='flex lg:hidden'>
            <Button variant='ghost' size='icon' className='shrink-0'>
              <Search className='h-5 w-5' />
              <span className='sr-only'>Search</span>
            </Button>
          </div>
          <div className='hidden lg:flex lg:grow'>
            {/* <div className='relative max-w-xs w-full'>
              <Input type='search' placeholder='Tìm kiếm...' className='pl-9' />
              <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                <Search className='h-4 w-4 text-gray-400' />
              </div>
            </div> */}
          </div>

          {/* Right: Actions */}
          <div className='flex items-center space-x-3'>
            <Button variant='ghost' size='icon' className='shrink-0'>
              <Bell className='h-5 w-5' />
              <span className='sr-only'>Notifications</span>
            </Button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant='ghost' className='flex items-center gap-2' role='combobox'>
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback>{user?.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className='hidden lg:flex flex-col items-start'>
                    <span className='text-sm font-medium'>{user?.fullName}</span>
                    {user?.role && (
                      <Badge
                        variant='outline'
                        className={cn('text-xs px-1.5 py-0 h-5', roleBadgeStyles[user.role])}
                      >
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[200px]'>
                <div className='px-2 py-1.5 text-xs text-muted-foreground flex items-center gap-1.5 border-b mb-1'>
                  <Badge variant='outline' className={roleBadgeStyles[user?.role || 'Guest']}>
                    {getRoleDisplayName(user?.role || 'Guest')}
                  </Badge>
                  {/* <span>Vai trò của bạn</span> */}
                </div>
                <DropdownMenuItem className='flex items-center gap-2' asChild>
                  <Link to={paths.profile} className='flex items-center gap-2 w-full'>
                    <User className='h-4 w-4' />
                    Hồ sơ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className='text-red-600' asChild>
                  <div className='flex items-center gap-2'>
                    <LogOut className='h-4 w-4' />
                    Đăng xuất
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
