import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../config/AxiosInstanceAdmin'; // Update the path as per your project structure
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Alert,
  ListItemButton,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import MainCard from 'user/components/UserMainCard';
import ReportIcon from '@mui/icons-material/DescriptionOutlined';

const AdminAllNotification = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
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

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axiosInstance.delete(`/notification/notifications/${notificationId}`);
      if (response.data.success) {
        setNotifications((currentNotifications) => currentNotifications.filter((notification) => notification._id !== notificationId));
      } else {
        setError('Failed to delete notification.');
      }
    } catch (error) {
      setError('Error deleting notification.');
      console.error('Error deleting notification:', error);
    }
  };
  const checkVariants = {
    hover: { scale: 1.2 },
    tap: { scale: 0.8 }
  };
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        All Notifications
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <List sx={{ py: 0 }}>
        <MainCard title="Notification">
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
                          <Typography component="span" variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary }}>
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
      </List>
    </Box>
  );
};

export default AdminAllNotification;
