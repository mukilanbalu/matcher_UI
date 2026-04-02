import { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'menu-items';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import { useTheme } from '@mui/material/styles';
import { handlerDrawerOpen, useGetMenuMaster } from 'services/menu';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation, useNavigate } from 'react-router-dom';
import profileService from 'services/profileService';
import AuthFooter from 'components/cards/AuthFooter';
import { Grid } from '@mui/material';
import ToastNotification from 'components/toaster/toast';
import MobileNavigation from './MobileNavigation';

import { drawerWidth } from 'config';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { menuMasterLoading, menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened || false;
  const theme = useTheme();
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    handlerDrawerOpen(!downXL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  // Temporarily disabled as per user request
  /*
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      profileService.searchProfiles({ filters: { email: user.email }, isFullProfile: true })
        .then((res) => {
          if ((res.status === 204 || (res.status === 200 && res.data.data?.length === 0)) && location.pathname !== '/my_profile') {
            navigate('/my_profile');
          }
        })
        .catch(() => {});
    }
  }, [isLoading, isAuthenticated, user, location.pathname, navigate]);
  */

  if (menuMasterLoading || isLoading) return <Loader />;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF9F3 0%, #FDF2F5 100%)' // Soft Gradient Background
    }}>
      <Box sx={{ display: 'flex', flexGrow: 1, width: '100%', pb: downLG ? '100px' : 0 }}>
        <Header />
        {!downLG && <Drawer />}
        <Box 
          component="main" 
          sx={{ 
            width: downLG ? '100%' : (drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%'), 
            flexGrow: 1, 
            p: { xs: 2, sm: 3 },
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen
            })
          }}
        >
          <Toolbar />
          <Breadcrumbs navigation={navigation} title />
          <Outlet />
        </Box>
      </Box>
      {!downLG && (
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      )}
      <MobileNavigation />
      <ToastNotification />
    </Box>
  );
}
