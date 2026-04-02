// assets
import { DashboardOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  HeartOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    }, {
      id: 'profile',
      title: 'My profile',
      type: 'item',
      url: '/my_profile',
      icon: icons.UserOutlined,
      breadcrumbs: false
    }, {
      id: 'interests',
      title: 'Interests',
      type: 'item',
      url: '/interests',
      icon: icons.HeartOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
