import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../config/AxiosInstanceUser'; // Update the path as per your project structure
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Alert,
  ListItemButton
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import MainCard from 'user/components/UserMainCard';

const UserAllNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;

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
    </Box>
  );
};

export default UserAllNotification;
