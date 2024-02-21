import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../../config/AxiosInstanceAdmin';
import {
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Typography,
  Grow,
  useTheme,
  ListItemButton,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import MainCard from 'user/components/UserMainCard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportIcon from '@mui/icons-material/DescriptionOutlined';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

const NotificationBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.getContrastText(theme.palette.secondary.main)
  }
}));

const Notification = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await axiosInstance.get(`/adminNotification/adminNotifications/${loggedInUserId}`);
        if (response.data && response.data.success) {
          setNotifications(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    }

    fetchNotifications();
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axiosInstance.delete(`/adminnotification/adminnotifications/${notificationId}`, {
        data: { userId: loggedInUserId }
      });
      if (response.data.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.notification_id !== notificationId)
        );
        console.log('Notification deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const checkVariants = {
    hover: { scale: 1.2 },
    tap: { scale: 0.8 }
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton ref={anchorRef} onClick={handleToggle} color="inherit">
        <NotificationBadge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </NotificationBadge>
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper elevation={4} sx={{ minWidth: 350, bgcolor: 'background.paper', overflow: 'hidden' }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  secondary={
                    <>
                      <IconButton size="small" onClick={handleToggle}>
                        <CloseOutlined />
                      </IconButton>
                      <Button
                        size="small"
                        onClick={() => {
                          navigate('/admin/alladminnotification');
                          handleClose(event);
                        }}
                        sx={{ ml: 1 }}
                      >
                        View All
                      </Button>
                    </>
                  }
                >
                  {notifications.length > 0 ? (
                    <List sx={{ padding: 0 }}>
                      {notifications.map((notification, index) => (
                        <React.Fragment key={index}>
                          <ListItem
                            alignItems="flex-start"
                            sx={{ py: 1, px: 2, backgroundColor: index % 2 ? theme.palette.action.hover : 'inherit' }}
                          >
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 1 }}>
                                <ReportIcon />
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={`${notification.userDetails.firstname} ${notification.userDetails.lastname}`}
                              primaryTypographyProps={{ fontWeight: 'bold', color: theme.palette.primary.dark }}
                              secondaryTypographyProps={{ component: 'div' }}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2" color="text.primary">
                                    Added a report in {notification.formDetails.formName}
                                  </Typography>
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    sx={{ display: 'block', color: theme.palette.text.secondary }}
                                  >
                                    For {notification.projectDetails.projectName} project
                                  </Typography>
                                </>
                              }
                            />
                            <ListItemButton sx={{ justifyContent: 'flex-end', bgcolor: 'transparent' }}>
                              <motion.div whileHover="hover" whileTap="tap" variants={checkVariants}>
                                <IconButton onClick={() => deleteNotification(notification.notification_id)} size="large">
                                  <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                                </IconButton>
                              </motion.div>
                            </ListItemButton>
                          </ListItem>
                          {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <ListItem sx={{ py: 4, justifyContent: 'center' }}>
                      <ListItemText primary="No new notifications" primaryTypographyProps={{ variant: 'subtitle1', textAlign: 'center' }} />
                    </ListItem>
                  )}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;
