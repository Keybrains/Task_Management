const express = require('express');
const router = express.Router();
const moment = require('moment');
const ReportingForm = require('../models/AddReportingForm');

router.post('/addform', async (req, res) => {
  try {
    const formData = req.body;

    // Generate unique form_id
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(5, 15);
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 10))
      .toString()
      .padStart(10, '0');
    const uniqueId = `${timestamp}${randomString}${randomNumber}`;
    formData.form_id = uniqueId;

    // Set createAt and updateAt timestamps using Date types
    formData.createAt = moment().format('YYYY-MM-DD HH:mm:ss');
    formData.updateAt = moment().format('YYYY-MM-DD HH:mm:ss');

    const newForm = new ReportingForm(formData);
    await newForm.save();

    res.status(201).json({ message: 'Form added successfully', form: newForm });
  } catch (error) {
    console.error('Error adding form:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/getforms', async (req, res) => {
  try {
    const forms = await ReportingForm.find();
    res.status(200).json({ forms });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/getforms/:admin_id', async (req, res) => {
  try {
    const { admin_id } = req.params;
    const forms = await ReportingForm.find({ admin_id });
    res.status(200).json({ forms });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/deleteform/:form_id', async (req, res) => {
  try {
    const { form_id } = req.params;

    // Find the form by form_id and delete it
    const deletedForm = await ReportingForm.findOneAndDelete({ form_id });

    if (!deletedForm) {
      // If the form with the given form_id is not found
      return res.status(404).json({ message: 'Form not found' });
    }

    res.status(200).json({ message: 'Form deleted successfully', deletedForm });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
