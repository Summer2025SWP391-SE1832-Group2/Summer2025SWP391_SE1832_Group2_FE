import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotification } from '@/hooks/useNotification';
import { useAuthStore } from '@/stores/auth';
import { Bell, X } from 'lucide-react';

const NotificationBell = () => {
  const { user } = useAuthStore();
  const { notifications, isLoading, notificationCount, markAsRead } = useNotification();

  if (user?.role !== 'Customer') {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {notificationCount > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs'
            >
              {notificationCount > 99 ? '99+' : notificationCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80' align='end'>
        <div className='px-3 py-2 text-xs text-muted-foreground border-b mb-1 flex items-center justify-between'>
          <span>Thông báo ({notifications.length})</span>
          {notificationCount > 0 && (
            <span className='text-blue-600 font-medium'>{notificationCount} chưa đọc</span>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className='px-3 py-4 text-center text-sm text-muted-foreground'>
            {isLoading ? 'Đang tải...' : 'Không có thông báo mới'}
          </div>
        ) : (
          <div className='max-h-60 overflow-y-auto'>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  !notification.isRead
                    ? 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500'
                    : 'border-l-4 border-transparent'
                }`}
                onClick={() => {
                  if (!notification.isRead) {
                    markAsRead(notification.id);
                  }
                }}
              >
                <div className='flex items-start justify-between w-full'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <div className='font-medium text-sm'>{notification.title}</div>
                      {!notification.isRead && (
                        <Badge
                          variant='secondary'
                          className='text-xs px-1.5 py-0 h-4 bg-blue-100 text-blue-700'
                        >
                          Mới
                        </Badge>
                      )}
                    </div>
                    <div className='text-xs text-muted-foreground mt-1'>{notification.body}</div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      {new Date(notification.receivedAt).toLocaleTimeString('vi-VN')}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
