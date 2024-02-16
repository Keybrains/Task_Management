import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'; // Ensure axios is installed
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
  Chip,
  ListItem
} from '@mui/material';
import MainCard from 'user/components/UserMainCard'; // Adjust import path as needed
import Transitions from 'components/@extended/Transitions'; // Adjust import path as needed
import { BellOutlined, CloseOutlined } from '@ant-design/icons'; // Ensure icons are correctly imported
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'; // Import Add icon
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined'; // Import Remove icon
// Assuming the notification object structure is something like:
// { id: number, title: string, message: string, time: string }
// Adjust according to your actual API response

const UserNotification = () => {
  const theme = useTheme();
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;
  const loggedInAdminId = parsedToken.userId?.admin_id;
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
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:4002/api/notification/notifications/${loggedInAdminId}/${loggedInUserId}`);
        // Check if the response has a 'data' field and it's an array
        if (response.data && Array.isArray(response.data.data)) {
          setNotifications(response.data.data); // Set the 'data' field of the response to the state
        } else {
          console.error('Expected an array of notifications, but got:', typeof response.data);
          setNotifications([]); // Set to an empty array if not the expected type
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

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
                          <ListItemButton sx={{ bgcolor: notification.isUnRead ? 'action.hover' : 'background.paper' }}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: notification.actionType === 'add' ? 'success.main' : 'error.main' }}>
                                {/* Using different icons for add/remove actions */}
                                {notification.actionType === 'add' ? (
                                  <AddCircleOutlineOutlinedIcon color="action" />
                                ) : (
                                  <RemoveCircleOutlineOutlinedIcon color="error" />
                                )}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  {notification.actionType === 'add'
                                    ? `Added to "${notification.projectDetails.projectName}"`
                                    : `Removed from "${notification.projectDetails.projectName}"`}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Typography variant="body2" component="span" color="textSecondary">
                                    {notification.message} {/* Display the message if available */}
                                  </Typography>
                                  {/* Display project details with a lighter font */}
                                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                    Priority: {notification.projectDetails.priority}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    Start: {notification.projectDetails.startDate} | End: {notification.projectDetails.endDate}
                                  </Typography>
                                </>
                              }
                            />
                            {notification.isUnRead && <Chip label="New" color="primary" size="small" sx={{ ml: 1, height: 'auto' }} />}
                          </ListItemButton>
                          {index < notifications.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <ListItem sx={{ justifyContent: 'center' }}>
                      <Typography variant="subtitle1">No notifications</Typography>
                    </ListItem>
                  )}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default UserNotification;
