// task.js (Model for Task)
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  formId: { type: String, ref: 'ReportingForm', required: true },
  userId: { type: String, ref: 'ReportingForm', required: true },
  adminId: { type: String, ref: 'ReportingForm', required: true },
  taskId: { type: String, ref: 'ReportingForm', required: true },
  formFields: {
    type: Object,
    required: true
    // Add more properties as needed for each field
  },
  createAt: {
    type: String
  },
  updateAt: {
    type: String
  }
  // Add any other fields you want to store for the task
});

const Task = mongoose.model('AddTask', TaskSchema);

module.exports = Task;
