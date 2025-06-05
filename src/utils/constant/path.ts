import type { UserRole } from '@/types/user';

/**
 * Application route constants
 */
export const paths = {
  // Public routes
  home: '/',
  login: 'login',
  register: 'register',
  profile: 'profile',
  forgotPassword: 'forgot-password',
  blog: 'blog-type/blog/:blogTypeId',
  blogType: 'blog-type',

  // Protected routes
  dashboard: '/dashboard',
  appointments: 'appointments',
  services: 'services',
  serviceDetail: (id: string) => `services/${id}`,

  // Payment results
  paymentSuccess: 'payment/success',
  paymentFailed: 'payment/failed',

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
