import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, useMediaQuery, useTheme } from '@mui/material';
import { HomeOutlined, HeartOutlined, MessageOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileNavigation = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  if (!isMobile) return null;

  const value = location.pathname;

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 20, 
        left: 20, 
        right: 20, 
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px 0 rgba(166, 98, 124, 0.4)',
        background: 'linear-gradient(45deg, #A6627C 30%, #D9AEBB 90%)',
        backdropFilter: 'blur(12px)',
        zIndex: 1300,
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }} 
      elevation={3}
    >
      <BottomNavigation
        showLabels={false}
        value={value}
        onChange={(event, newValue) => {
          navigate(newValue);
        }}
        sx={{ 
          background: 'transparent',
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .Mui-selected': {
            color: '#fff !important',
            '& .anticon': {
              color: '#fff !important',
              transform: 'scale(1.2)',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))'
            }
          }
        }}
      >
        <BottomNavigationAction 
          value="/" 
          icon={<HomeOutlined style={{ fontSize: '1.4rem' }} />} 
        />
        <BottomNavigationAction 
          value="/interests" 
          icon={<HeartOutlined style={{ fontSize: '1.4rem' }} />} 
        />
         <BottomNavigationAction 
          value="/search" 
          icon={<SearchOutlined style={{ fontSize: '1.4rem' }} />} 
        />
        <BottomNavigationAction 
          value="/my_profile" 
          icon={<UserOutlined style={{ fontSize: '1.4rem' }} />} 
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileNavigation;
