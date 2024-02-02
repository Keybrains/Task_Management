const express = require('express');
const router = express.Router();
const moment = require('moment');
const AddUser = require('../models/AddUser');
const AddProject = require('../models/Addproject');
const { hashPassword, hashCompare, createToken } = require('../utils/authhelper');

router.post('/adduser', async (req, res) => {
  try {
    const { email, phonenumber } = req.body;

    // Check for existing user with the same email or phone number
    const existingUser = await AddUser.findOne({
      $or: [{ email: email }, { phonenumber: phonenumber }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(401).json({
          success: false,
          message: 'Email already in use'
        });
      } else if (existingUser.phonenumber === phonenumber) {
        return res.status(402).json({
          success: false,
          message: 'Phone number already in use'
        });
      }
    }
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(5, 15);
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
      .toString()
      .padStart(10, '0');
    const uniqueId = `${timestamp}${randomString}${randomNumber}`;
    const userUniqueId = (req.body['user_id'] = uniqueId);
    const createTime = (req.body['createAt'] = moment().format('YYYY-MM-DD HH:mm:ss'));
    const updateTime = (req.body['updateAt'] = moment().format('YYYY-MM-DD HH:mm:ss'));
    const hashedPassword = await hashPassword(req.body.password);
    const { project_ids } = req.body;
    const newUser = new AddUser({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      companyname: req.body.companyname,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      projectName: req.body.projectName,
      project_ids: project_ids || [],
      admin_id: req.body.admin_id,
      password: hashedPassword,
      createAt: createTime,
      updateAt: updateTime,
      user_id: userUniqueId
    });

    await newUser.save();

    res.json({
      success: true,
      message: 'User SignUp Successful'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

router.get('/getusers', async (req, res) => {
  try {
    const users = await AddUser.find({}, '-password'); // Exclude the password field
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

router.get('/getuserbyadmin/:adminId', async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const users = await AddUser.find({ admin_id: adminId }, '-password'); // Exclude the password field

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found for this admin'
      });
    }

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

router.post('/userlogin', async (req, res) => {
  try {
    const user = await AddUser.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist'
      });
    }

    const compare = await hashCompare(req.body.password, user.password);

    if (!compare) {
      return res.status(422).json({
        success: false,
        message: 'Wrong password'
      });
    }

    const { token, expiresIn } = await createToken(user);

    res.json({
      success: true,
      data: user,
      expiresAt: expiresIn,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error
    });
  }
});

router.put('/updateuser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Find user by user_id and update
    const user = await AddUser.findOneAndUpdate(
      { user_id: userId },
      { $set: updateData },
      { new: true } // Return the updated document
    );

    // If no user is found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Exclude password from the response
    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.json({
      success: true,
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

// DELETE API to delete user by user_id
router.delete('/deleteuser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by user_id and delete
    const deletedUser = await AddUser.findOneAndDelete({ user_id: userId });

    // If no user is found
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      deletedUserId: userId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

router.put('/edituser/:userId', async (req, res) => {
  const { userId } = req.params;
  const updates = req.body; // Fields to update

  try {
    // If a new password is provided, hash it before saving
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    // Update admin data
    const updatedUser = await AddUser.findOneAndUpdate({ user_id: userId }, updates, { new: true, runValidators: true }).select(
      '-password'
    ); // Do not return the password

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User data updated successfully',
      admin: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

router.get('/getprojects/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by their user_id
    const user = await AddUser.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Retrieve projects based on the user's project_ids
    const projects = await AddProject.find({
      project_id: { $in: user.project_ids }
    });

    res.json({
      success: true,
      projects
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