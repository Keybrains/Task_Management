// tasks.js (Route for Tasks)
const express = require('express');
const router = express.Router();
const moment = require('moment');
const Task = require('../models/AddTask'); // Import your Task model
const User = require('../models/AddUser');
// POST route to add a task
router.post('/addtask', async (req, res) => {
  try {
    const { formId, formFields, userId, adminId } = req.body;
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(5, 15);
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
      .toString()
      .padStart(10, '0');
    const uniqueId = `${timestamp}${randomString}${randomNumber}`;
    const taskId = uniqueId; // Set taskId to uniqueId

    const updateAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const createAt = moment().format('YYYY-MM-DD HH:mm:ss');

    const newTask = new Task({
      formId,
      formFields,
      userId,
      adminId,
      taskId, // Assign taskId to the field in the schema
      createAt,
      updateAt
    });

    await newTask.save();

    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/adminstasks/:adminId', async (req, res) => {
  try {
    const adminId = req.params.adminId;

    // Retrieve all tasks for the specified adminId
    const tasks = await Task.find({ adminId });

    // Loop through tasks and fetch user details for each task
    const tasksWithUserDetails = await Promise.all(
      tasks.map(async (task) => {
        const user = await User.findOne({ user_id: task.userId });
        return {
          taskId: task._id,
          formId: task.formId,
          formFields: task.formFields,
          userId: task.userId,
          adminId: task.adminId,
          userFirstName: user ? user.firstname : 'N/A',
          userLastName: user ? user.lastname : 'N/A'
        };
      })
    );

    res.status(200).json(tasksWithUserDetails);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/userstasks/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve all tasks for the specified adminId
    const tasks = await Task.find({ userId });

    // Loop through tasks and fetch user details for each task
    const tasksWithUserDetails = await Promise.all(
      tasks.map(async (task) => {
        const user = await User.findOne({ user_id: task.userId });
        return {
          taskId: task._id,
          formId: task.formId,
          formFields: task.formFields,
          userId: task.userId,
          adminId: task.adminId,
          userFirstName: user ? user.firstname : 'N/A',
          userLastName: user ? user.lastname : 'N/A'
        };
      })
    );

    res.status(200).json(tasksWithUserDetails);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/deletetask/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Check if the task exists
    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete the task
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
