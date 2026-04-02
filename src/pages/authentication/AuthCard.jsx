import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

export default function AuthCard({ children, ...other }) {
  return (
    <MainCard
      sx={{ 
        maxWidth: { xs: 400, lg: 475 }, 
        margin: { xs: 2.5, md: 3 }, 
        '& > *': { flexGrow: 1, flexBasis: '50%' },
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(16px)',
        borderRadius: '32px',
        boxShadow: '0 8px 32px 0 rgba(166, 98, 124, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}
      content={false}
      {...other}
      border={false}
    >
      <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
    </MainCard>
  );
}

AuthCard.propTypes = { children: PropTypes.node, other: PropTypes.any };
