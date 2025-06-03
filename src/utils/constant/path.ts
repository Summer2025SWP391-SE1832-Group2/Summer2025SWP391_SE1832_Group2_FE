/**
 * Application route constants
 */
export const paths = {
  // Public routes
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  blog: '/blog',
  blogType: '/blog-type',
  // Fallback
  notFound: '*',
} as const;
