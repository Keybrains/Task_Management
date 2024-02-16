const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const moment = require('moment');
const AddProject = require('../models/Addproject');

router.post('/notifications', async (req, res) => {
  try {
    const { userId, projectId, actionType, adminId } = req.body;
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(5, 15);
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
      .toString()
      .padStart(10, '0');
    const uniqueId = `${timestamp}${randomString}${randomNumber}`;

    const notificationUniqueId = (req.body['chat_id'] = uniqueId);

    const newNotification = new Notification({
      notification_id: notificationUniqueId,
      userId,
      projectId,
      actionType,
      adminId,
      createAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updateAt: moment().format('YYYY-MM-DD HH:mm:ss')
      // Add any other notification-related fields as needed
    });

    const savedNotification = await newNotification.save();

    res.status(201).json({
      success: true,
      data: savedNotification,
      message: 'Notification created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
});

router.get('/notifications/:adminId/:userId', async (req, res) => {
  try {
    const { adminId, userId } = req.params;

    let notifications = await Notification.find({
      adminId: adminId,
      userId: userId
    });

    if (notifications.length > 0) {
      // Enhance notifications with project details
      const notificationsWithProjects = await Promise.all(notifications.map(async (notification) => {
        // Assuming 'projectId' is stored in your notification and corresponds to 'project_id' in AddProject
        const project = await AddProject.findOne({ project_id: notification.projectId });

        // Add project details to the notification object
        // Note: This assumes you want to include the entire project object; adjust as needed
        notification = notification.toObject(); // Convert to plain object to allow modification
        notification.projectDetails = project ? project : null;

        return notification;
      }));

      res.status(200).json({
        success: true,
        data: notificationsWithProjects
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No notifications found for the provided adminId and userId'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});


module.exports = router;
