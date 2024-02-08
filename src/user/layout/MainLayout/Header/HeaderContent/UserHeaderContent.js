// material-ui
import { Box, useMediaQuery } from '@mui/material';
// import { GithubOutlined } from '@ant-design/icons';
import React from 'react';
// The rest of your imports

// project import
import Search from './UserSearch';
import Profile from './Profile/UserProfile';
import Notification from './UserNotification';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

const UserHeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      {!matchesXs && <Search />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

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

      <Notification />
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default UserHeaderContent;
