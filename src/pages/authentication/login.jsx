import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';
import Logo from 'components/logo/LogoMain';
import { Box } from '@mui/material';

// ================================|| LOGIN ||================================ //

export default function Login(props) {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ width: "250px", display: "block", margin: "0 auto" }}>
            <Logo />
          </Box>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            {/* <Typography variant="h3">Login</Typography> */}


          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin setCurrentUser={props.setCurrentUser} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
