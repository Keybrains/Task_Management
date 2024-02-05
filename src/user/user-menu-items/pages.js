import { LoginOutlined, ProfileOutlined, UserOutlined, AppstoreOutlined, FileTextOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  UserOutlined,
  ReportIcon: FileTextOutlined, // Use the chosen icon for "Report"
  ProjectIcon: AppstoreOutlined
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
      icon: icons.ProjectIcon
    },
    {
      id: 'addtask',
      title: 'Add Report',
      type: 'item',
      url: '/user/addtask',
      icon: icons.ReportIcon
    }
  ]
};

export default pages;
