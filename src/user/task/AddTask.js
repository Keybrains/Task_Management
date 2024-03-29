import React, { useEffect, useState } from 'react';
import axiosInstance from 'user/config/AxiosInstanceUser';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Grid,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'user/components/Loader';

const fullScreenLoaderStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1500
};

const AddTask = () => {
  //get logged user data
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInAdminId = parsedToken.userId?.admin_id;
  const loggedInUserId = parsedToken.userId?.user_id;

  //lodder
  const [loading, setLoading] = useState(true);

  //add task
  const [openDialog, setOpenDialog] = useState(false);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get(`/addusers/getprojects/${loggedInUserId}`);
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  const fetchForms = async (projectId) => {
    try {
      const response = await axiosInstance.get(`/addreportingfrom/getprojectforms/${projectId}`);
      setForms(response.data.forms || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      fetchForms(selectedProject);
    }
  }, [selectedProject]);

  //for from all fields
  const [formFields, setFormFields] = useState({});

  const handleFormChange = (event) => {
    const formId = event.target.value;
    const selectedForm = forms.find((form) => form.form_id === formId);
    setSelectedForm(selectedForm);
    setFormFields({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const renderFormFields = () => {
    if (!selectedForm || !selectedForm.fields) {
      return null;
    }

    return selectedForm.fields.map((field, index) => {
      let fieldComponent;

      switch (field.fieldType) {
        case 'text':
          fieldComponent = (
            <TextField
              key={index}
              style={{ marginTop: '15px' }}
              fullWidth
              label={field.fieldName}
              variant="outlined"
              name={field.fieldName}
              value={formFields[field.fieldName] || ''}
              onChange={handleChange}
              type="text"
            />
          );
          break;
        case 'checkbox':
          fieldComponent = (
            <div key={index} style={{ marginTop: '15px' }}>
              <label style={{ marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>{field.fieldName}</label>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {field.options &&
                  field.options.map((option, optionIndex) => (
                    <div key={optionIndex} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        name={field.fieldName}
                        value={option}
                        checked={formFields[field.fieldName]?.includes(option)}
                        onChange={handleCheckboxChange}
                      />
                      <span style={{ marginLeft: '4px' }}>{option}</span>
                    </div>
                  ))}
              </div>
            </div>
          );
          break;
        case 'radio':
          fieldComponent = (
            <div key={index} style={{ marginTop: '15px' }}>
              <label style={{ marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>{field.fieldName}</label>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {field.options &&
                  field.options.map((option, optionIndex) => (
                    <div key={optionIndex} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="radio"
                        name={field.fieldName}
                        value={option}
                        checked={formFields[field.fieldName] === option}
                        onChange={handleChange}
                      />
                      <span style={{ marginLeft: '4px' }}>{option}</span>
                    </div>
                  ))}
              </div>
            </div>
          );
          break;
        case 'date':
          fieldComponent = (
            <TextField
              key={index}
              style={{ marginTop: '15px' }}
              fullWidth
              label={field.fieldName}
              variant="outlined"
              name={field.fieldName}
              value={formFields[field.fieldName] || ''}
              onChange={handleChange}
              type="date"
              InputLabelProps={{
                shrink: true
              }}
            />
          );
          break;
        default:
          fieldComponent = null;
      }

      return fieldComponent;
    });
  };

  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;

    // If the checkbox value is already in the array, remove it; otherwise, add it
    const updatedValues = checked ? [...(formFields[name] || []), value] : formFields[name].filter((option) => option !== value);

    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: updatedValues
    }));
  };

  const handleSaveTask = async () => {
    try {
      setLoading(true);
      const taskData = {
        userId: loggedInUserId,
        adminId: loggedInAdminId,
        projectId: selectedProject,
        projectName: projects.find((project) => project.project_id === selectedProject)?.projectName || '', // Get projectName based on projectId
        formId: selectedForm?.form_id,
        formFields
      };

      await axiosInstance.post('/addtasks/addtask', taskData);
      await sendNotification('add', taskData.userId, taskData.adminId, taskData.projectId, taskData.formId);

      toast.success('Task added successfully');
      handleCloseDialog();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Error saving task');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedForm(null);
    setFormFields({});
  };

  //fetch task

  const [tasks, setTasks] = useState([]);
  const [selectedTaskProject, setSelectedTaskProject] = useState(null);
  const [selectedTaskForm, setSelectedTaskForm] = useState(null);

  const fetchTasks = async (projectId, formId) => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(`/addtasks/userstasks/${loggedInUserId}?projectId=${projectId}&formId=${formId}`);

      if (response.data && response.data.length > 0) {
        const filteredTasks = response.data.filter((task) => task.projectId === projectId && task.formId === formId);
        setTasks(filteredTasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTaskProject && selectedTaskForm) {
      fetchTasks(selectedTaskProject, selectedTaskForm);
    }
  }, [selectedTaskProject, selectedTaskForm]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const getUniqueFormFields = () => {
    const uniqueFormFields = new Set();
    tasks.forEach((task) => {
      Object.keys(task.formFields).forEach((key) => uniqueFormFields.add(key));
    });
    return Array.from(uniqueFormFields);
  };

  const uniqueFormFields = getUniqueFormFields();

  //delete task

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find((form) => form.taskId === taskId);
    setTaskToDelete(taskToDelete);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/addtasks/deletetask/${taskToDelete.taskId}`);
      toast.success('Task deleted successfully');
      const updatedTasks = tasks.filter((task) => task.taskId !== taskToDelete.taskId);
      setTasks(updatedTasks);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error deleting task');
    }
  };

  const handleCloseDeleteDialog = () => {
    setTaskToDelete(null);
    setOpenDeleteDialog(false);
  };

  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  //filter report data using date
  const [filterstartDate, setFilterStartDate] = useState('');
  const [filterendDate, setFilterEndDate] = useState('');

  const filteredTasksByDateRange = tasks.filter((task) => {
    const taskDate = new Date(task.createAt);
    const start = filterstartDate ? new Date(filterstartDate) : null;
    const end = filterendDate ? new Date(filterendDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    return (!start || taskDate >= start) && (!end || taskDate <= end);
  });

  const sendNotification = async (actionType, userId, adminId, projectId, formId) => {
    try {
      {
        const notificationData = {
          actionType,
          userId,
          adminId,
          projectId,
          formId
        };
        const response = await axiosInstance.post('/adminnotification/adminnotifications', notificationData);
        console.log('Notification response:', response.data);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <>
      {loading && (
        <div style={fullScreenLoaderStyle}>
          <Loader />
        </div>
      )}
      <div style={loading ? { display: 'none' } : {}}>
        <Grid container spacing={3} alignItems="center" justifyContent="space-between" style={{ paddingTop: '10px' }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" gutterBottom>
              All Tasks
            </Typography>
          </Grid>
          <Grid item container xs={12} md={8} spacing={3} justifyContent="flex-end">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                select
                fullWidth
                style={{ minWidth: '200px', marginRight: '10px' }}
                label="Select Project"
                variant="outlined"
                name="projectId"
                value={selectedTaskProject || ''}
                onChange={(event) => {
                  const projectId = event.target.value;
                  setSelectedTaskProject(projectId);
                  setSelectedForm(null);
                  fetchForms(projectId);
                }}
              >
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <MenuItem key={project.project_id} value={project.project_id}>
                      {project.projectName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No projects available</MenuItem>
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                select
                fullWidth
                style={{ minWidth: '200px' }}
                label="Select Form"
                variant="outlined"
                name="formId"
                value={selectedTaskForm || ''}
                onChange={(event) => {
                  const formId = event.target.value;
                  setSelectedTaskForm(formId);
                }}
              >
                {forms.length > 0 ? (
                  forms.map((form) => (
                    <MenuItem key={form.form_id} value={form.form_id}>
                      {form.formName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No forms available</MenuItem>
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Button variant="contained" style={{ backgroundColor: 'rgba(60,62,75, 1)' }} onClick={handleOpenDialog} fullWidth>
                Add Report
              </Button>
            </Grid>
          </Grid>
          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
            <DialogTitle style={{ backgroundColor: 'rgba(60,62,75, 1)', color: '#fff' }}>Add New Task</DialogTitle>
            <DialogContent>
              <form>
                <TextField
                  select
                  style={{ marginTop: '30px' }}
                  fullWidth
                  label="Select Project"
                  variant="outlined"
                  name="projectId"
                  value={selectedProject || ''}
                  onChange={(event) => {
                    setSelectedProject(event.target.value);
                    setSelectedForm(null);
                    setFormFields({});
                  }}
                >
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <MenuItem key={project.project_id} value={project.project_id}>
                        {project.projectName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No projects available</MenuItem>
                  )}
                </TextField>
                <TextField
                  select
                  style={{ marginTop: '30px' }}
                  fullWidth
                  label="Select Form"
                  variant="outlined"
                  name="formId"
                  value={selectedForm?.form_id || ''}
                  onChange={handleFormChange}
                >
                  {forms.length > 0 ? (
                    forms.map((form) => (
                      <MenuItem key={form.form_id} value={form.form_id}>
                        {form.formName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No forms available</MenuItem>
                  )}
                </TextField>
                {renderFormFields()}
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleSaveTask} style={{ backgroundColor: 'rgba(60,62,75, 1)', color: '#fff' }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Save Task'}
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Grid container spacing={3} alignItems="center" style={{ paddingTop: '25px' }}>
          <Grid item xs={12}>
            {selectedTaskProject && selectedTaskForm ? (
              tasks.length > 0 ? (
                <>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Box display="flex" flexDirection="row" justifyContent="space-between" style={{ marginTop: '25px', width: '100%' }}>
                      <Box flexGrow={1} marginRight={2}>
                        <TextField
                          label="From"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={filterstartDate}
                          onChange={(e) => setFilterStartDate(e.target.value)}
                        />
                      </Box>
                      <Box flexGrow={1}>
                        <TextField
                          label="To"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={filterendDate}
                          onChange={(e) => setFilterEndDate(e.target.value)}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <TableContainer container component={Paper} style={{ marginTop: '10px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ backgroundColor: 'rgba(60,62,75, 1)', color: 'white' }}>Created On</TableCell>
                          {uniqueFormFields.map((field) => (
                            <TableCell key={field} style={{ backgroundColor: 'rgba(60,62,75, 1)', color: 'white' }}>
                              {field}
                            </TableCell>
                          ))}
                          <TableCell style={{ backgroundColor: 'rgba(60,62,75, 1)', color: 'white' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTasksByDateRange.length > 0 ? (
                          filteredTasksByDateRange.map((task) => (
                            <TableRow key={task._id}>
                              <TableCell>{formatDate(task.createAt)}</TableCell>
                              {uniqueFormFields.map((field) => (
                                <TableCell key={`${task._id}-${field}`}>
                                  {Array.isArray(task.formFields[field])
                                    ? task.formFields[field].join(', ')
                                    : task.formFields[field] || 'N/A'}
                                </TableCell>
                              ))}
                              <TableCell>
                                <IconButton onClick={() => handleDeleteTask(task._id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={uniqueFormFields.length + 2} align="center">
                              No tasks available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      count={filteredTasksByDateRange.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 15, 25, { label: 'All', value: -1 }]}
                      labelRowsPerPage="Rows per page:"
                      labelDisplayedRows={({ from, to, count }) => (
                        <div style={{ fontSize: '14px', fontStyle: 'italic', marginTop: '5px' }}>
                          Showing {from}-{to} of {count !== -1 ? count : 'more than'}
                        </div>
                      )}
                      SelectProps={{
                        style: { marginBottom: '0px' },
                        renderValue: (value) => `${value} rows`
                      }}
                      nextIconButtonProps={{
                        style: {
                          marginBottom: '0px'
                        }
                      }}
                      backIconButtonProps={{
                        style: {
                          marginBottom: '0px'
                        }
                      }}
                    />
                  </TableContainer>
                </>
              ) : (
                <Typography variant="body1" style={{ paddingTop: '15px', fontWeight: 'bold' }}>
                  No reports available for the selected project and form.
                </Typography>
              )
            ) : (
              <Typography variant="body1" style={{ paddingTop: '15px', fontWeight: 'bold' }}>
                Please select a project and form to display reports.
              </Typography>
            )}
          </Grid>
        </Grid>
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>Are you sure you want to delete the task</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </div>
    </>
  );
};

export default AddTask;
