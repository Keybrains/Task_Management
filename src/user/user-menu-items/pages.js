import { LoginOutlined, ProfileOutlined, UserOutlined, AppstoreOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  UserOutlined,
  ProjectIcon: AppstoreOutlined // Assuming AppstoreOutlined as the Project icon
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'allproject',
      title: 'All Project',
      type: 'item',
      url: '/user/allproject',
      icon: icons.ProjectIcon // Use the chosen icon for "All Project"
    },
    {
      id: 'addtask',
      title: 'Add Task',
      type: 'item',
      url: '/user/addtask',
      icon: icons.UserOutlined
    }
  ]
};

export default pages;
