import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const SuperAuthLogin = Loadable(lazy(() => import('superadmin/pages/authentication/SuperAdminLogin')));
const SuperAuthRegister = Loadable(lazy(() => import('superadmin/pages/authentication/SuperAdminRegister')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'superadminlogin',
      element: <SuperAuthLogin />
    },
    {
      path: 'superadminregister',
      element: <SuperAuthRegister />
    }
  ]
};

export default LoginRoutes;
