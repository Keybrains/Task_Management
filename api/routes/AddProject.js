const express = require('express');
const router = express.Router();
const moment = require('moment');
const AddProject = require('../models/Addproject');

router.post('/addproject', async (req, res) => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(5, 15);
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
      .toString()
      .padStart(10, '0');
    const uniqueId = `${timestamp}${randomString}${randomNumber}`;
    const userUniqueId = (req.body['project_id'] = uniqueId);
    const createTime = (req.body['createAt'] = moment().format('YYYY-MM-DD HH:mm:ss'));
    const updateTime = (req.body['updateAt'] = moment().format('YYYY-MM-DD HH:mm:ss'));

    const newProject = new AddProject({
      admin_id: req.body.admin_id,
      projectName: req.body.projectName,
      projectShortName: req.body.projectShortName,
      priority: req.body.priority,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      createAt: createTime,
      updateAt: updateTime,
      project_id: userUniqueId
    });

    await newProject.save();

    res.json({
      success: true,
      message: 'Project Add Successful'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

router.get('/projects/:adminId', async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const projects = await AddProject.find({ admin_id: adminId });

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects found for the provided admin ID'
      });
    }

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

router.get('/projects/names/:adminId', async (req, res) => {
  try {
    const adminId = req.params.adminId;
    // Using projection to get both the projectName and project_id fields
    const projects = await AddProject.find({ admin_id: adminId }, 'projectName project_id');

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects found for the provided admin ID'
      });
    }

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

module.exports = router;
