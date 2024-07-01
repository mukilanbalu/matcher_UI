// material-ui
import { useTheme } from '@mui/material/styles';

import logo from 'assets/images/logo.png';


// ==============================|| LOGO SVG ||============================== //

const Logo = (props) => {
  const theme = useTheme();

  return (

    <img src={logo} alt="Matcher" width={"100%"} />
  );
};

export default Logo;
