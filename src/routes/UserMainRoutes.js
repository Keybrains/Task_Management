import { lazy } from 'react';

// project import
import Loadable from 'user/components/Loadable';
import UserMainLayout from 'user/layout/MainLayout/UserMainLayout';
import RequireAuth from 'RequireAuth';
import AddTask from 'user/task/AddTask';
import AllProjects from 'user/projects/AllProjects';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('user/pages/dashboard/UserDashboardDefault')));

// render - utilities
const Typography = Loadable(lazy(() => import('user/pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('user/pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('user/pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('user/pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const UserMainRoutes = {
  path: '/user',
  element: (
    <RequireAuth>
      <UserMainLayout />
    </RequireAuth>
  ),
  children: [
    {
      path: '/user',
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
      path: 'addtask',
      element: <AddTask />
    },
    {
      path: 'allproject',
      element: <AllProjects />
    },
  ]
};

export default UserMainRoutes;
