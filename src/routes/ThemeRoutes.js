import { useRoutes } from 'react-router-dom';

// project import
import AdminLoginRoutes from './AdminLoginRoutes';
import AdminMainRoutes from './AdminMainRoutes';
import SuperLoginRoutes from './SuperAdminLoginRoutes';
import SuperAdminMainRoutes from './SuperAdminRotes';
import UserLoginRoutes from './UserLoginRoutes';
import UserMainRoutes from './UserMainRoutes';
import Page404 from 'page404/Page404';
// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([
    AdminMainRoutes,
    AdminLoginRoutes,
    SuperAdminMainRoutes,
    SuperLoginRoutes,
    UserLoginRoutes,
    UserMainRoutes,
    { path: '*', element: <Page404 /> }
  ]);
}
