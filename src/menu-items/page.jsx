// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'profile1',
      title: 'Profile 1',
      type: 'item',
      url: '/profile',
      icon: icons.ProfileOutlined,
      target: true
    }
  ]
};

export default pages;
