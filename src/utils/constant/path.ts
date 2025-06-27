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

  bookingHistory: '/bookinghistory',
  booking: (serviceId: string) => `/booking/${serviceId}`,
  bookingDetail: (bookingId: string) => `/bookingdetail/${bookingId}`,
  blogdetail: (blogId: string) => `/viewblog/${blogId}`,

  // Protected routes
  dashboard: '/dashboard',
  appointments: '/appointments',
  services: '/services',
  bookingList: '/bookinglist',
  addResult: '/result/add/:id',
  staffschedule : '/staffschedules',
  blogManagement : '/blogManagement',
  blogcreate: '/blogManagement/blogcreate',
  blogdetailManagement: (blogId: string) => `/blogManagement/blogdetail/${blogId}`,
  userManagement: '/userManagement',
  testParameterManagement: '/testParameterManagement',
  reports: '/reports',
  settings: '/settings',

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
