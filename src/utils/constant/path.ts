import type { UserRole } from '@/types/user';

/**
 * Application route constants
 */
export const paths = {
  // Public routes
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  forgotPassword: '/forgot-password',
  blog: '/blog-type/blog/:blogTypeId',
  blogType: '/blog-type',
  result: '/result',
  bookingHistory: '/bookinghistory',
  bookingDetail: (bookingId: string) => `/bookingdetail/${bookingId}`,




  // Protected routes
  dashboard: '/dashboard',
  appointments: '/dashboard/appointments',
  services: '/dashboard/services',
  serviceDetail: (id: string) => `/dashboardservices/${id}`,
  dashboardProfile: '/dashboard/profile',
  bookingList: '/dashboard/bookinglist',
  addResult: '/dashboard/addresult',
  staffschedule : '/dashboard/staffschedules',


  // Payment results
  paymentSuccess: '/payment/success',
  paymentFailed: '/payment/failed',

  // Fallback
  notFound: '*',
} as const;

export const getDefaultRouteByRole = (role?: UserRole) => {
  switch (role) {
    case 'Staff':
    case 'Manager':
    case 'Admin':
      return paths.dashboard;
    case 'Customer':
      return paths.home;
    default:
      return paths.login;
  }
};
