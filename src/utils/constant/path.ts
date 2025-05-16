/**
 * Application route constants
 */
export const paths = {
  // Public routes
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",

  // Fallback
  notFound: "*",
} as const;
