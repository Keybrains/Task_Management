import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout/index';

// render - login
const AdminAuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AdminAuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));

// ==============================|| AUTH ROUTING ||============================== //

const AdminLoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'adminlogin',
      element: <AdminAuthLogin />
    },
    {
      path: 'adminregister',
      element: <AdminAuthRegister />
    }
  ]
};

export default AdminLoginRoutes;
