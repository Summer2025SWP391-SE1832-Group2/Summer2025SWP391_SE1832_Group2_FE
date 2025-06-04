import MainLayout from '@/components/layout/main-layout';
import LoginPage from '@/pages/auth/login';
import RegisterPage from '@/pages/auth/register';
import HomePage from '@/pages/home';
import { paths } from '@/utils/constant/path';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: paths.login,
        element: <LoginPage />,
      },

      {
        path: paths.register,
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: paths.notFound,
    element: <Navigate to={paths.home} />,
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
