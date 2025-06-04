import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { paths } from '@/utils/constant/path';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace />;
  }

  return children;
};

export default ProtectedRoute;
