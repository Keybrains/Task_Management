const express = require('express');
const router = express.Router();
const moment = require('moment');
const Task = require('../models/AddTask');
const User = require('../models/AddUser');
const AddProject = require('../models/Addproject');

router.post('/addtask', async (req, res) => {
  try {
    const { formId, formFields, userId, adminId, projectId, projectName } = req.body;
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(5, 15);
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
      .toString()
      .padStart(10, '0');
    const uniqueId = `${timestamp}${randomString}${randomNumber}`;
    const taskId = uniqueId;

    const updateAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const createAt = moment().format('YYYY-MM-DD HH:mm:ss');

    const newTask = new Task({
      formId,
      formFields,
      userId,
      adminId,
      taskId,
      projectName,
      projectId,
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

    const tasks = await Task.find({ adminId });

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

    const tasks = await Task.find({ userId });

    const tasksWithUserDetails = await Promise.all(
      tasks.map(async (task) => {
        const user = await User.findOne({ user_id: task.userId });
        const project = await AddProject.findOne({ project_id: task.projectId }); // Add this line to get project details

        return {
          taskId: task._id,
          formId: task.formId,
          formFields: task.formFields,
          userId: task.userId,
          adminId: task.adminId,
          userFirstName: user ? user.firstname : 'N/A',
          userLastName: user ? user.lastname : 'N/A',
          projectId: task.projectId,
          projectName: project ? project.projectName : 'N/A' // Include project details
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

    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/userstasks/:userId', async (req, res) => {
  const { userId } = req.params;
  const { projectId, formId } = req.query; // Get projectId and formId from query parameters

  try {
    let query = { userId };

    if (projectId) {
      query.projectId = projectId;
    }

    if (formId) {
      query.formId = formId;
    }

    const tasks = await Task.find(query); // Adjust this line according to your database query method
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// router.get('/adminstasks/:adminId', async (req, res) => {
//   const { adminId } = req.params;
//   const { projectId, formId } = req.query;

//   try {
//     let query = { adminId };

//     if (projectId) {
//       query.projectId = projectId;
//     }

//     if (formId) {
//       query.formId = formId;
//     }

//     const tasks = await Task.find(query);
//     res.status(200).json(tasks);
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

router.get('/adminstasks/:adminId', async (req, res) => {
  const { adminId } = req.params;
  const { projectId, formId } = req.query;

  try {
    let query = { adminId };

    if (projectId) {
      query.projectId = projectId;
    }

    if (formId) {
      query.formId = formId;
    }

    const tasks = await Task.find(query);

    // Fetch additional details for each task
    const tasksWithDetails = await Promise.all(
      tasks.map(async (task) => {
        const user = await User.findOne({ user_id: task.userId });
        const project = await AddProject.findOne({ project_id: task.projectId });

        return {
          taskId: task._id,
          formId: task.formId,
          formFields: task.formFields,
          userId: task.userId,
          adminId: task.adminId,
          userFirstName: user ? user.firstname : 'N/A',
          userLastName: user ? user.lastname : 'N/A',
          projectId: task.projectId,
          projectName: project ? project.projectName : 'N/A'
        };
      })
    );

    res.status(200).json(tasksWithDetails);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
