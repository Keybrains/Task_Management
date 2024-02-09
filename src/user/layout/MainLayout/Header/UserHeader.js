import PropTypes from 'prop-types';
import React from 'react';
// The rest of your imports

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, IconButton, Toolbar, useMediaQuery, Box } from '@mui/material';

// project import
import AppBarStyled from './UserAppBarStyled';
import HeaderContent from './HeaderContent/UserHeaderContent';

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //
import Logo from 'assets/banners/1.jpg';
import Logo1 from 'assets/banners/2.jpg';
import Logo2 from 'assets/banners/3.jpg';
import Logo3 from 'assets/banners/4.jpg';
import Logo4 from 'assets/banners/5.jpg';
import Logo5 from 'assets/banners/6.jpg';

import { Stack } from '@mui/material';

const UserHeader = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const iconBackColor = 'grey.100';
  const iconBackColorOpen = 'grey.200';

  // common header
  const mainHeader = (
    <>
       <Stack
        direction= 'row'
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 2 , mt: 2}}
      >
        {[Logo, Logo1, Logo2, Logo3, Logo4 ,Logo5].map((src, index) => (
          <React.Fragment key={index}>
            <Box
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': { transform: 'scale(1.05)', transition: 'transform .2s' },
              }}
            >
              <img src={src} alt={`Banner ${index + 1}`} height={100} width={180} style={{ display: 'block' }} />
            </Box>
            <br />
          </React.Fragment>
        ))}
      </Stack>
      <Toolbar>
        <IconButton
          disableRipple
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          color="secondary"
          sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 } }}
        >
          {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </IconButton>
        <HeaderContent />
      </Toolbar>
    </>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`
      // boxShadow: theme.customShadows.z1
    }
  };

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled open={open} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

UserHeader.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

export default UserHeader;
