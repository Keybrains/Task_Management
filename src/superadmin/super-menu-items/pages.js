import { LoginOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  UserOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'addadmin',
      title: 'Add Admin',
      type: 'item',
      url: '/superadmin/addadmin',
      icon: icons.UserOutlined
    }
  ]
};

export default pages;
