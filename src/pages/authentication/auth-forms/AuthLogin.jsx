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
              sx={{ 
                borderRadius: '24px',
                background: 'linear-gradient(45deg, #A6627C 30%, #D9AEBB 90%)',
                boxShadow: '0 4px 15px rgba(166, 98, 124, 0.2)'
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Button 
              disableElevation 
              onClick={handleGoogleLogin} 
              fullWidth 
              size="large" 
              variant="contained" 
              sx={{ 
                py: 1.5,
                borderRadius: '24px',
                background: '#fff',
                color: '#000',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 4px 12px rgba(166, 98, 124, 0.1)',
                '&:hover': {
                  background: '#f8f8f8',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(166, 98, 124, 0.2)'
                }
              }}
              startIcon={<img src={Google} alt="Google" style={{ width: 20 }} />}
            >
              Sign in with Google
            </Button>
          )}
        </AnimateButton>
      </Grid>
    </Grid>
  );
}
