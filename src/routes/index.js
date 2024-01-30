import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import SuperLoginRoutes from './SuperAdminLoginRoutes';
import SuperAdminRoutes from './SuperAdminRotes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, LoginRoutes, SuperAdminRoutes, SuperLoginRoutes]);
}
