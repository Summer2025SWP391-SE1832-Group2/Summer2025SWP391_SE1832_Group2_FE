import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import { type UserRole } from '@/types/user';
import {

  Calendar,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  TestTube,
 
} from 'lucide-react';
import BrandLogo from '@/components/common/brand-logo';
import { paths } from '@/utils/constant/path';
import { useState } from 'react';

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: Array<UserRole>;
  children?: Array<SidebarLink>;
}

const sidebarLinks: SidebarLink[] = [
  {
    title: 'Tổng quan',
    href: paths.dashboard,
    icon: <LayoutDashboard className='h-5 w-5' />,
    roles: ['Admin'],
  },
  {
    title: 'Dịch vụ',
    href: paths.services,
    icon: <Package className='h-5 w-5' />,
    roles: ['Admin'],
  },
  {
    title: 'Lịch hẹn',
    href: paths.appointments,
    icon: <Calendar className='h-5 w-5' />,
    roles: ['Manager'],
  },
  {
    title: 'Lịch Làm việc',
    href: paths.staffschedule,
    icon: <Calendar className='h-5 w-5' />,
    roles: ['Staff', 'Manager'],
  },
  {
    title: 'Quản lý thông số xét nghiệm',
    href: paths.testParameterManagement,
    icon: <TestTube className='h-5 w-5' />,
    roles: ['Manager'],
  },
  {
    title: 'Quản lý người dùng',
    href: paths.userManagement,
    icon: <TestTube className='h-5 w-5' />,
    roles: ['Admin'],
  },
  {
    title: 'Nhập mẫu',
    href: paths.bookingList,
    icon: <Package className='h-5 w-5' />,
    roles: ['Staff', 'Manager'],
  },
  {
    title: 'Báo cáo',
    href: paths.reports,
    icon: <FileText className='h-5 w-5' />,
    roles: ['Manager', 'Admin'],
  },
  {
    title: 'Blogs',
    href: paths.blogManagement,
    icon: <FileText className='h-5 w-5' />,
    roles: ['Manager'],
  },
  {
    title: 'Cài đặt',
    href: paths.settings,
    icon: <Settings className='h-5 w-5' />,
    roles: ['Admin'],
  },
];


const DashboardSidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const filteredLinks = sidebarLinks.filter((link) => link.roles.includes(user?.role as UserRole));

  const isLinkActive = (href: string) => {
    // Exact match for dashboard to prevent highlighting when on sub-routes
    if (href === '/dashboard') {
      return location.pathname === href;
    }
    // For other routes, check if the pathname includes the href
    return location.pathname.includes(href);
  };

  const toggleExpand = (href: string) => {
    setExpanded((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

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
          {filteredLinks.map((link) => {
            const hasSubLinks = link.children && link.children.length > 0;
            const isActive = isLinkActive(link.href);
            const isExpandedLink = expanded[link.href];

            return (
              <div key={link.href}>
                <Button
                  variant='ghost'
                  className={cn(
                    'w-full justify-between',
                    isActive && 'bg-gray-100 dark:bg-gray-700',
                  )}
                  onClick={() => hasSubLinks && toggleExpand(link.href)}
                >
                  <Link to={hasSubLinks ? '#' : link.href} className='w-full flex justify-between'>
                    <div className='flex items-center gap-2'>
                      {link.icon}
                      {link.title}
                    </div>
                    {hasSubLinks && (
                      <ChevronDown className={cn('h-4 w-4', isExpandedLink && 'rotate-180')} />
                    )}
                  </Link>
                </Button>

                {hasSubLinks && isExpandedLink && (
                  <div className='ml-6 space-y-1 mt-1'>
                    {link.children?.map((child) => (
                      <Button
                        key={child.href}
                        variant='ghost'
                        asChild
                        className={cn(
                          'w-full justify-start',
                          isLinkActive(child.href) && 'bg-gray-100 dark:bg-gray-700',
                        )}
                      >
                        <Link to={child.href} className='flex items-center gap-2'>
                          {child.icon}
                          {child.title}
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
