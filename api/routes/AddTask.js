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

router.get('/adminstasks/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params;
    const { userId } = req.query;

    let query = { adminId };
    if (userId) {
      query.userId = userId;
    }

    const tasks = await Task.find(query).sort({ createAt: -1 });

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
          userLastName: user ? user.lastname : 'N/A',
          createAt: task.createAt
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

    const tasks = await Task.find({ userId }).sort({ createAt: -1 });

    const tasksWithUserDetails = await Promise.all(
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
          projectName: project ? project.projectName : 'N/A',
          createAt: task.createAt
        };
      })
    );

    res.status(200).json(tasksWithUserDetails);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/report/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ userId });

    const reportData = tasks.map((task) => {
      const { _id, formId, projectId, projectName, createAt, updateAt, formFields } = task;
      return {
        taskId: _id,
        formId,
        projectId,
        projectName,
        createdAt: createAt,
        updatedAt: updateAt,
        formFields
      };
    });

    res.status(200).json(reportData);
  } catch (error) {
    console.error('Error retrieving tasks report:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
