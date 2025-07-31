import { onMessageListener } from '@/lib/firebase';
import { getNotifications, markNotificationAsRead } from '@/services/notification_service';
import { useAuthStore } from '@/stores/auth';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
  };
}

export const useNotification = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch notifications from API
  const notificationsQuery = useQuery({
    queryKey: ['notifications', user?.userId],
    queryFn: () => getNotifications(user?.userId || 0),
    enabled: !!user?.userId && user?.role === 'Customer',
  });

  // Calculate notification count based on unread notifications
  const notificationCount = notificationsQuery.data?.filter((n) => !n.isRead).length || 0;

  // Mutation for marking notification as read
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Refetch notifications to update the list
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.userId] });
      toast.success('Đã đánh dấu đã đọc');
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
      toast.error('Có lỗi xảy ra khi đánh dấu đã đọc');
    },
  });

  // Listen to Firebase messages
  useEffect(() => {
    if (user?.role !== 'Customer' || !user?.userId) return;

    let isListening = true;

    const handleMessage = async () => {
      try {
        const payload = (await onMessageListener()) as NotificationPayload;

        if (!isListening) return;

        // Show toast notification
        toast(payload?.notification?.title || 'Thông báo mới', {
          description: payload?.notification?.body || 'Bạn có thông báo mới',
          duration: 5000,
        });

        // Refetch notifications from API
        queryClient.invalidateQueries({ queryKey: ['notifications', user.userId] });
        // Continue listening
        if (isListening) {
          handleMessage();
        }
      } catch (error) {
        console.error('Error handling Firebase notification:', error);
        // Continue listening even if there's an error
        if (isListening) {
          handleMessage();
        }
      }
    };

    // Start listening
    handleMessage();

    // Cleanup
    return () => {
      isListening = false;
    };
  }, [user?.role, user?.userId, queryClient]);

  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,
    refetch: notificationsQuery.refetch,
    notificationCount,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
  };
};
