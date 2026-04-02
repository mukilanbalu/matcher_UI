// material-ui
import { useTheme } from '@mui/material/styles';

import logo from 'assets/images/logo.png';


// ==============================|| LOGO SVG ||============================== //

import { Typography } from '@mui/material';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  return (
    <Typography
      variant="h3"
      sx={{
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 700,
        color: 'primary.main',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}
    >
      Matcher
    </Typography>
  );
};

export default Logo;
