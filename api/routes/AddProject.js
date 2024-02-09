const express = require('express');
const router = express.Router();
const moment = require('moment');
const AddProject = require('../models/Addproject');

// post
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
    let projects = await AddProject.find({ admin_id: adminId });

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects found for the provided admin ID'
      });
    }

    // Reverse the projects array
    projects = projects.reverse();

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

router.put('/editproject/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const updatedProject = await AddProject.findOneAndUpdate(
      { project_id: projectId },
      {
        $set: req.body, // Update fields sent in request body
        updateAt: moment().format('YYYY-MM-DD HH:mm:ss') // Update the 'updateAt' field to current time
      },
      { new: true } // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

router.delete('/deleteproject/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    // Ensure projectId is correctly parsed/validated if needed
    // For instance, if project_id is supposed to be a number, ensure it's parsed as one
    // const projectId = parseInt(req.params.projectId);

    const deletedProject = await AddProject.findOneAndDelete({ project_id: projectId });

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
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
