import { lazy } from 'react';

// project import
import Loadable from 'user/components/Loadable';
import MinimalLayout from 'user/layout/MinimalLayout/UserMinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('user/pages/authentication/UserLogin')));
const AuthRegister = Loadable(lazy(() => import('user/pages/authentication/UserRegister')));

// ==============================|| AUTH ROUTING ||============================== //

const UserLoginRoutes = {
  path: '/user',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    },
    {
      path: 'userregister',
      element: <AuthRegister />
    }
  ]
};

export default UserLoginRoutes;
