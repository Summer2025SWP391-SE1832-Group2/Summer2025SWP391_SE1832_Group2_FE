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
<<<<<<< Updated upstream

  // Protected routes
  dashboard: '/dashboard',
  appointments: '/dashboard/appointments',
  services: '/dashboard/services',
  serviceDetail: (id: string) => `/services/${id}`,

  // Payment results
  paymentSuccess: '/payment-success',
  paymentFailed: '/payment-failed',
=======
  bookingHistory: '/bookinghistory',
  bookingDetail: (bookingId: string)=> `/bookingdetail/${bookingId}`,
  
 
  
  // Protected routes
  dashboard: '/dashboard',
  appointments: '/dashboardappointments',
  services: '/dashboardservices',
  serviceDetail: (id: string) => `/dashboardservices/${id}`,
  dashboardProfile: '/dashboard/profile',


  // Payment results
  paymentSuccess: '/payment/success',
  paymentFailed: '/payment/failed',
>>>>>>> Stashed changes

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
