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
  const { notifications, isLoading, notificationCount, markAsRead, isMarkingAsRead } =
    useNotification();

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
        <div className='px-2 py-1.5 text-xs text-muted-foreground border-b mb-1'>
          Thông báo ({notifications.length})
        </div>
        {notifications.length === 0 ? (
          <div className='px-3 py-4 text-center text-sm text-muted-foreground'>
            {isLoading ? 'Đang tải...' : 'Không có thông báo mới'}
          </div>
        ) : (
          <div className='max-h-60 overflow-y-auto'>
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className='flex flex-col items-start p-3'>
                <div className='flex items-start justify-between w-full'>
                  <div className='flex-1'>
                    <div className='font-medium text-sm'>{notification.title}</div>
                    <div className='text-xs text-muted-foreground mt-1'>{notification.body}</div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      {new Date(notification.receivedAt).toLocaleTimeString('vi-VN')}
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 ml-2'
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    disabled={isMarkingAsRead}
                  >
                    <X className='h-3 w-3' />
                  </Button>
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
