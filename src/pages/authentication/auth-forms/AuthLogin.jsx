import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { useAuth0 } from "@auth0/auth0-react";
import Google from 'assets/images/icons/google.svg';

// ============================|| GOOGLE - LOGIN ||============================ //

export default function AuthLogin() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleGoogleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',
      }
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <AnimateButton>
          {isAuthenticated ? (
            <Button 
              disableElevation 
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} 
              fullWidth 
              size="large" 
              variant="contained" 
              color="primary"
            >
              Logout
            </Button>
          ) : (
            <Button 
              disableElevation 
              onClick={handleGoogleLogin} 
              fullWidth 
              size="large" 
              variant="outlined" 
              color="secondary"
              startIcon={<img src={Google} alt="Google" />}
            >
              Login with Google
            </Button>
          )}
        </AnimateButton>
      </Grid>
    </Grid>
  );
}
