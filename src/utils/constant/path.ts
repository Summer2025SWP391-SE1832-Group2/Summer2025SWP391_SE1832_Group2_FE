import type { UserRole } from '@/types/user';

/**
 * Application route constants
 */
export const paths = {
  // Public routes
  home: '/',
  login: '/login',
  register: '/register',
  blog: '/blog-type/blog/:blogTypeId',
  blogType: '/blog-type',

  profile: '/profile',
  transaction: '/transaction',
  resetPassword: '/reset-password',
  result: '/result',
  bookingHistory: '/bookinghistory',
  booking: (serviceId: string) => `/booking/${serviceId}`,
  bookingDetail: (bookingId: string) => `/bookingdetail/${bookingId}`,
  blogdetail: (blogId: string) => `/viewblog/${blogId}`,

  // Protected routes
  dashboard: '/dashboard',
  appointments: '/dashboard/appointments',
  services: '/dashboard/services',
  dashboardProfile: '/dashboard/profile',
  bookingList: '/dashboard/bookinglist',
  addResult: '/dashboard/addresult',
  staffschedule: '/dashboard/staffschedules',
  scheduleforstaff : '/dashboard/schedules',
  blogmanage: '/dashboard/blogmanage',
  blogcreate: '/dashboard/blogmanage/blogcreate',
  blogdetailManage: (blogId: string) => `/dashboard/blogmanage/blogdetail/${blogId}`,

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
