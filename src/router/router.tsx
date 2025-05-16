import { paths } from "../utils/constant/path";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import HomePage from "../pages/home";

const router = createBrowserRouter([
  {
    path: paths.home,
    element: <HomePage />,
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
