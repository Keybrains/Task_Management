// AddTask.js
import React, { useEffect, useState } from 'react';
import axiosInstance from 'user/config/AxiosInstanceUser'; // Assume you have an axios instance
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
  IconButton
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
  //addtask
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInAdminId = parsedToken.userId?.admin_id;
  const loggedInUserId = parsedToken.userId?.user_id;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  console.log('selectedForm', selectedForm);

  const [loading, setLoading] = useState(true);

  //get all froms
  const [forms, setForms] = useState([]);
  const [formFields, setFormFields] = useState({});
  const fetchForms = async () => {
    try {
      const response = await axiosInstance.get(`/addreportingfrom/getforms/${loggedInAdminId}`);
      setForms(response.data.forms || []);
      console.log('response.data.forms', response.data.forms);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedForm(null);
    setFormFields({});
  };

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

  const handleSaveTask = async () => {
    try {
      setLoading(true);

      // Prepare the data to be sent to the backend
      const taskData = {
        userId: loggedInUserId,
        adminId: loggedInAdminId,
        formId: selectedForm?.form_id,
        formFields
      };

      // Add logic to save the task data to the backend
      await axiosInstance.post('/addtasks/addtask', taskData);

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

  ////all task
  const [tasks, setTasks] = useState([]);

  // Fetch tasks with user details from the backend
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(`/addtasks/userstasks/${loggedInUserId}`);
      setTasks(response.data);
      console.log('response.data', response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Function to get unique form field keys
  const getUniqueFormFields = () => {
    const uniqueFormFields = new Set();
    tasks.forEach((task) => {
      Object.keys(task.formFields).forEach((key) => uniqueFormFields.add(key));
    });
    return Array.from(uniqueFormFields);
  };

  const uniqueFormFields = getUniqueFormFields();

  // Conditionally render the table only when there is data
  // if (tasks.length === 0) {
  //   return <div style={{ paddingTop: '25px' }}>No report available.</div>;
  // }

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteForm = (taskId) => {
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

  return (
    <>
      {loading && (
        <div style={fullScreenLoaderStyle}>
          <Loader />
        </div>
      )}
      <div style={loading ? { display: 'none' } : {}}>
        <Grid container spacing={3} style={{ paddingTop: '15px' }}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" gutterBottom>
                All Task
              </Typography>

              <Button variant="contained" style={{ backgroundColor: 'rgba(60,62,75, 1)' }} onClick={handleOpenDialog}>
                Add Task
              </Button>

              <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle style={{ backgroundColor: 'rgba(60,62,75, 1)', color: '#fff' }}>Add New Task</DialogTitle>
                <DialogContent>
                  <form>
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
                      {forms.map((form) => (
                        <MenuItem key={form.form_id} value={form.form_id}>
                          {form.formName}
                        </MenuItem>
                      ))}
                    </TextField>
                    {selectedForm &&
                      selectedForm.fields.map((field, index) => (
                        <TextField
                          style={{ marginTop: '15px' }}
                          key={index}
                          fullWidth
                          label={field.fieldName}
                          variant="outlined"
                          name={field.fieldName}
                          value={formFields[field.fieldName] || ''}
                          onChange={handleChange}
                          type={field.fieldType === 'date' ? 'date' : 'text'} // Set type to 'date' for date fields
                          InputLabelProps={{
                            shrink: field.fieldType === 'date' ? 'date' : 'text' // Ensure label doesn't overlap when date is selected
                          }}
                          InputProps={{
                            placeholder: field.fieldType === 'date' ? 'date' : 'text' // Set placeholder to undefined for non-date fields
                          }}
                        />
                      ))}
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
            </Box>
          </Grid>
          <Grid item xs={12}>
            {tasks.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {/* <TableCell style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }}>User Name</TableCell> */}
                      {uniqueFormFields.map((field) => (
                        <>
                          <TableCell style={{ backgroundColor: 'rgba(60,62,75, 1)', color: 'white' }} key={field}>
                            {field}
                          </TableCell>
                        </>
                      ))}
                      <TableCell style={{ backgroundColor: 'rgba(60,62,75, 1)', color: 'white' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.taskId}>
                        {/* <TableCell>
                    {task.userFirstName} {task.userLastName}
                  </TableCell> */}
                        {uniqueFormFields.map((field) => (
                          <>
                            <TableCell key={field}>{task.formFields[field] || 'N/A'}</TableCell>
                          </>
                        ))}
                        <TableCell>
                          <IconButton onClick={() => handleDeleteForm(task.taskId)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" style={{ paddingTop: '0px', fontWeight: 'bold' }}>
                No tasks available.
              </Typography>
            )}
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
        </Grid>
      </div>
    </>
  );
};

export default AddTask;
