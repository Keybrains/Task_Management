import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import AdminMainLayout from 'superadmin/layout/MainLayout/AdminMainLayout';
import AddAdmin from 'superadmin/addaadmin/AddAdmin';
import RequireAuth from 'RequireAuth';
import Addproject from 'superadmin/project/Addproject';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('superadmin/pages/dashboard/SuperAdminDashboardDefault')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('superadmin/pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('superadmin/pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('superadmin/pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('superadmin/pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const SuperAdminRotes = {
  path: '/superadmin',
  element: (
    <RequireAuth>
      <AdminMainLayout />
    </RequireAuth>
  ),
  children: [
    {
      path: '/superadmin',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'icons/ant',
      element: <AntIcons />
    },
    {
      path: 'addadmin',
      element: <AddAdmin />
    },
    {
      path: 'addproject',
      element: <Addproject />
    }
  ]
};

export default SuperAdminRotes;
