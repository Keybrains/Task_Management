// assets
import { ProjectOutlined, UserAddOutlined } from '@ant-design/icons';

// icons
const icons = {
  ProjectOutlined,
  UserAddOutlined
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
    }
  ]
};

export default pages;
