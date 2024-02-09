// ThemeRoutes.js

import { useRoutes } from 'react-router-dom';
import Redirect from './Redirect'; // Adjust the import path as necessary

// Import all your route configurations
import AdminLoginRoutes from './AdminLoginRoutes';
import AdminMainRoutes from './AdminMainRoutes';
import SuperLoginRoutes from './SuperAdminLoginRoutes';
import SuperAdminMainRoutes from './SuperAdminRotes';
import UserLoginRoutes from './UserLoginRoutes';
import UserMainRoutes from './UserMainRoutes';
import Page404 from 'page404/Page404'; // Adjust the import path as necessary

const ThemeRoutes = () => {
  return useRoutes([
    { path: '/', element: <Redirect to="/admin/login" /> },
    AdminMainRoutes,
    AdminLoginRoutes,
    SuperAdminMainRoutes,
    SuperLoginRoutes,
    UserLoginRoutes,
    UserMainRoutes,
    { path: '*', element: <Page404 /> }
  ]);
};

export default ThemeRoutes; // Export the ThemeRoutes function
