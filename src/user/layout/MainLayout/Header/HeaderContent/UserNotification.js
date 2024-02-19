import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popper,
  Typography,
  useMediaQuery,
  ListItem
} from '@mui/material';
import axiosInstance from '../../../../config/AxiosInstanceUser';
import MainCard from 'user/components/UserMainCard';
import Transitions from 'components/@extended/Transitions';
import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

const UserNotification = () => {
  const theme = useTheme();
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const fetchFormNotifications = async () => {
      try {
        const response = await axiosInstance.get(`/notification/userNotifications/${loggedInUserId}`);
        if (response.data && Array.isArray(response.data.data)) {
          setNotifications(response.data.data);
        } else {
          console.error('Expected an array of notifications, but got:', typeof response.data.data);

          setNotifications([]);
        }
      } catch (error) {
        console.error('Failed to fetch form notifications:', error);
      }
    };

    fetchFormNotifications();
  }, [loggedInUserId]);

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axiosInstance.delete(`/notification/notifications/${notificationId}`, {
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
      <IconButton
        disableRipple
        color="secondary"
        sx={{ color: 'text.primary', bgcolor: open ? 'grey.300' : 'grey.100' }}
        aria-label="open notifications"
        ref={anchorRef}
        aria-controls={open ? 'notification-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={notifications.length} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -5 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 285,
                maxWidth: 420,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285
                }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <List sx={{ py: 0 }}>
                  <MainCard
                    title="Notification"
                    secondary={
                      <IconButton size="small" onClick={handleToggle}>
                        <CloseOutlined />
                      </IconButton>
                    }
                  >
                    {notifications.length > 0 ? (
                      <List sx={{ p: 0 }}>
                        {notifications.map((notification, index) => (
                          <React.Fragment key={notification._id}>
                            <ListItemButton sx={{ bgcolor: 'transparent' }}>
                              <ListItemAvatar>
                                <Avatar>
                                  {notification.actionType === 'add' ? (
                                    <AddCircleOutlineOutlinedIcon sx={{ color: 'success.main' }} />
                                  ) : (
                                    <RemoveCircleOutlineOutlinedIcon sx={{ color: 'error.main' }} />
                                  )}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {notification.formId
                                      ? `Add Form: "${notification.formDetails?.formName}"`
                                      : notification.actionType === 'add'
                                      ? `Added to "${notification.projectDetails?.projectName}"`
                                      : `Removed from "${notification.projectDetails?.projectName}"`}
                                  </Typography>
                                }
                                secondary={
                                  <>
                                    <Typography variant="body2" component="span" color="textSecondary"></Typography>
                                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                      {notification.formId
                                        ? `Project: ${notification.projectDetails?.projectName}`
                                        : `Priority: ${notification.projectDetails?.priority}`}
                                    </Typography>
                                    {!notification.formId && (
                                      <Typography variant="caption" display="block">
                                        Start: {notification.projectDetails?.startDate} | End: {notification.projectDetails?.endDate}
                                      </Typography>
                                    )}
                                  </>
                                }
                              />
                              <ListItemButton sx={{ justifyContent: 'flex-end', bgcolor: 'transparent' }}>
                                <motion.div whileHover="hover" whileTap="tap" variants={checkVariants}>
                                  <IconButton
                                    onClick={() => deleteNotification(notification.notification_id)}
                                    size="large"
                                    sx={{ color: 'success.main' }}
                                  >
                                    <CheckCircleIcon sx={{ fontSize: 20 }} />
                                  </IconButton>
                                </motion.div>
                              </ListItemButton>
                            </ListItemButton>
                            {index < notifications.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <ListItem sx={{ py: 4, justifyContent: 'center' }}>
                        <ListItemText primary="No new notifications" primaryTypographyProps={{ variant: 'subtitle1' }} />
                      </ListItem>
                    )}
                  </MainCard>
                </List>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default UserNotification;
