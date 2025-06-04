import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types/user-role';
import {
  BarChart3,
  Calendar,
  FileText,
  LayoutDashboard,
  Settings,
  TestTube,
  Users,
} from 'lucide-react';
import BrandLogo from '@/components/common/brand-logo';
import { paths } from '@/utils/constant/path';

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: Array<UserRole>;
}

const sidebarLinks: SidebarLink[] = [
  {
    title: 'Tổng quan',
    href: '/dashboard',
    icon: <LayoutDashboard className='h-5 w-5' />,
    roles: ['Staff', 'Manager', 'Admin'],
  },
  {
    title: 'Thống kê',
    href: '/dashboard/analytics',
    icon: <BarChart3 className='h-5 w-5' />,
    roles: ['Manager', 'Admin'],
  },
  {
    title: 'Lịch hẹn',
    href: '/dashboard/appointments',
    icon: <Calendar className='h-5 w-5' />,
    roles: ['Staff', 'Manager', 'Admin'],
  },
  {
    title: 'Xét nghiệm',
    href: '/dashboard/tests',
    icon: <TestTube className='h-5 w-5' />,
    roles: ['Staff', 'Manager', 'Admin'],
  },
  {
    title: 'Báo cáo',
    href: '/dashboard/reports',
    icon: <FileText className='h-5 w-5' />,
    roles: ['Manager', 'Admin'],
  },
  {
    title: 'Người dùng',
    href: '/dashboard/users',
    icon: <Users className='h-5 w-5' />,
    roles: ['Admin'],
  },
  {
    title: 'Cài đặt',
    href: '/dashboard/settings',
    icon: <Settings className='h-5 w-5' />,
    roles: ['Admin'],
  },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const filteredLinks = sidebarLinks.filter((link) => link.roles.includes(user?.role as UserRole));

  return (
    <div className='w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700'>
      {/* Sidebar header */}
      <div className='h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700'>
        <Link to={paths.dashboard}>
          <BrandLogo />
        </Link>
      </div>

      {/* Sidebar content */}
      <div className='p-4'>
        <nav className='space-y-1'>
          {filteredLinks.map((link) => (
            <Button
              key={link.href}
              variant='ghost'
              asChild
              className={cn(
                'w-full justify-start gap-2',
                location.pathname === link.href && 'bg-gray-100 dark:bg-gray-700',
              )}
            >
              <Link to={link.href}>
                {link.icon}
                {link.title}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
