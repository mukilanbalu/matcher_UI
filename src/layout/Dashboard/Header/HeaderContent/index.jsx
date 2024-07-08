// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
// project import
import { GithubOutlined } from '@ant-design/icons';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { i18n } = useTranslation();
  const [checked, setChecked] = useState(false)

  const handleLanguageChange = (e) => {
    setChecked(e.target.checked)
    i18n.changeLanguage(e.target.checked ? "ta" : "en");
  };

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: "#177ddc",
      boxSizing: 'border-box',
    },
  }));

  return (
    <>
      {!downLG &&
        <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }} />
      }
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      {/* <IconButton
        component={Link}
        href="https://github.com/codedthemes/mantis-free-react-admin-template"
        target="_blank"
        disableRipple
        color="secondary"
        title="Download Free Version"
        sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
      >
        <GithubOutlined />
      </IconButton> */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>English</Typography>
        <AntSwitch inputProps={{ 'aria-label': 'ant design' }} checked={checked} onChange={handleLanguageChange} />
        <Typography>தமிழ்</Typography>
      </Stack>
      {/* <Notification /> */}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
