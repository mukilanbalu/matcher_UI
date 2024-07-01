import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { useAuth0 } from "@auth0/auth0-react";
// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin(props) {

  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <>
      <Grid item xs={12}>
        <AnimateButton>
          {isAuthenticated ?
            <Button disableElevation onClick={logout} fullWidth size="large" variant="contained" color="primary">
              Logout
            </Button> :
            <Button disableElevation onClick={loginWithRedirect} fullWidth size="large" variant="contained" color="primary">
              Login
            </Button>}
        </AnimateButton>
      </Grid>

    </>
  );
}
