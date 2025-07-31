export interface Notification {
  id: number;
  userId: number;
  title: string;
  body: string;
  receivedAt: string;
  isRead: boolean;
}
