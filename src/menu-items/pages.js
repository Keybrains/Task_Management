// assets
import { ProjectOutlined, UserAddOutlined, FileAddOutlined, DatabaseOutlined } from '@ant-design/icons';

// icons
const icons = {
  ProjectOutlined,
  UserAddOutlined,
  FileAddOutlined,
  DatabaseOutlined
};
// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'addproject',
      title: 'Add Project',
      type: 'item',
      url: '/admin/addproject',
      icon: icons.ProjectOutlined
      // target: true
    },
    {
      id: 'adduser',
      title: 'Add Team',
      type: 'item',
      url: '/admin/adduser',
      icon: icons.UserAddOutlined
      // target: true
    },
    {
      id: 'addform',
      title: 'Add Form',
      type: 'item',
      url: '/admin/addform',
      icon: icons.FileAddOutlined
      // target: true
    },
    {
      id: 'Report',
      title: 'All Report',
      type: 'item',
      url: '/admin/reports',
      icon: icons.DatabaseOutlined
      // target: true
    }
    // {
    //   id: 'Report',
    //   title: 'All Report',
    //   type: 'item',
    //   url: '/admin/alreports',
    //   icon: icons.DatabaseOutlined
    //   // target: true
    // }
  ]
};

export default pages;
