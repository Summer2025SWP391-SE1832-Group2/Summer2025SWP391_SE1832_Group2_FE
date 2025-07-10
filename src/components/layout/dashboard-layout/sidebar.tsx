import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import { type UserRole } from '@/types/user';
import {
  Calendar,
  ChevronDown,
  FileText,
  Package,
  TestTube,
  Users,
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

const staffLinks: SidebarLink[] = [
  {
    title: 'Lịch hẹn',
    href: paths.staff.appointments,
    icon: <Calendar className='h-5 w-5' />,
    roles: ['Staff'],
  },
  {
    title: 'Lịch Làm việc',
    href: paths.staff.scheduleforstaff,
    icon: <Calendar className='h-5 w-5' />,
    roles: ['Staff'],
  },
  {
    title: 'Nhập mẫu',
    href: paths.staff.bookingList,
    icon: <Package className='h-5 w-5' />,
    roles: ['Staff'],
  },
];

const managerLinks: SidebarLink[] = [
  {
    title: 'Lịch hẹn',
    href: paths.manager.appointments,
    icon: <Calendar className='h-5 w-5' />,
    roles: ['Manager'],
  },
  {
    title: 'Lịch Làm việc',
    href: paths.manager.staffSchedules,
    icon: <Calendar className='h-5 w-5' />,
    roles: ['Manager'],
  },
  {
    title: 'Thông số xét nghiệm',
    href: paths.manager.parameterList,
    icon: <TestTube className='h-5 w-5' />,
    roles: ['Manager'],
  },
  {
    title: 'Thông số dịch vụ',
    href: paths.manager.testParameterList,
    icon: <TestTube className='h-5 w-5' />,
    roles: ['Manager'],
  },
  {
    title: 'Blogs',
    href: paths.manager.blogManage,
    icon: <FileText className='h-5 w-5' />,
    roles: ['Manager'],
  },
];

const adminLinks: SidebarLink[] = [
  {
    title: 'Người dùng',
    href: paths.admin.users,
    icon: <Users className='h-5 w-5' />,
    roles: ['Admin'],
  },
  {
    title: 'Thông số xét nghiệm',
    href: paths.admin.parameterList,
    icon: <TestTube className='h-5 w-5' />,
    roles: ['Admin'],
  },
  {
    title: 'Thông số dịch vụ',
    href: paths.admin.testParameterList,
    icon: <TestTube className='h-5 w-5' />,
    roles: ['Admin'],
  },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const role = user?.role as UserRole;
  let combinedLinks: SidebarLink[] = [];

  let defaultDashboardPath = '/';
  if (role === 'Staff') {
    combinedLinks = staffLinks;
    defaultDashboardPath = paths.staff.dashboard;
  } else if (role === 'Manager') {
    combinedLinks = managerLinks;
    defaultDashboardPath = paths.manager.dashboard;
  } else if (role === 'Admin') {
    combinedLinks = adminLinks;
    defaultDashboardPath = paths.admin.dashboard;
  }

  const isLinkActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href);
  };

  const toggleExpand = (href: string) => {
    setExpanded((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  return (
    <div className='w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700'>
      <div className='h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700'>
        <Link to={defaultDashboardPath}>
          <BrandLogo />
        </Link>
      </div>

      <div className='p-4'>
        <nav className='space-y-1'>
          {combinedLinks.map((link) => {
            const hasSubLinks = link.children && link.children.length > 0;
            const isActive = isLinkActive(link.href);
            const isExpandedLink = expanded[link.href];

            return (
              <div key={link.href}>
                <Button
                  variant='ghost'
                  className={cn(
                    'w-full justify-between px-3',
                    isActive && 'bg-gray-100 dark:bg-gray-700'
                  )}
                  onClick={() => hasSubLinks && toggleExpand(link.href)}
                >
                  <Link
                    to={hasSubLinks ? '#' : link.href}
                    className='w-full flex justify-between items-center'
                  >
                    <div className='flex items-center gap-2'>
                      {link.icon}
                      {link.title}
                    </div>
                    {hasSubLinks && (
                      <ChevronDown
                        className={cn('h-4 w-4 transition-transform', {
                          'rotate-180': isExpandedLink,
                        })}
                      />
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
                          isLinkActive(child.href) && 'bg-gray-100 dark:bg-gray-700'
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