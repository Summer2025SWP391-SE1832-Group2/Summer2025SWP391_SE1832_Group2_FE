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
  result: '/result/:id',
  bookingHistory: '/bookinghistory',
  favorite: '/favorite',

  booking: (serviceId: string) => `/booking/${serviceId}`,
  bookingDetail: (bookingId: string) => `/bookingdetail/${bookingId}`,
  blogdetail: (blogId: string) => `/viewblog/${blogId}`,

  // Protected routes
  dashboard: '/dashboard',
  appointments: '/dashboard/appointments',
  services: '/dashboard/services',
  dashboardProfile: '/dashboard/profile',
  bookingList: '/dashboard/bookinglist',
  staffschedule: '/dashboard/staffschedules',
  scheduleforstaff: '/dashboard/schedules',
  blogmanage: '/dashboard/blogmanage',
  blogcreate: '/dashboard/blogmanage/blogcreate',
  parameterlist: '/dashboard/parameterlist',
  testparameterlist: '/dashboard/testparameterlist',
  testparameterdetail: (serviceId: string) => `/dashboard/testparameterdetail/${serviceId}`,

  blogdetailManage: (blogId: string) => `/dashboard/blogmanage/blogdetail/${blogId}`,
  addResult: '/dashboard/result/add/:id',
  // Payment results
  paymentSuccess: '/payment-success',
  paymentFailed: '/payment-failed',

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
