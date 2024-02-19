import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  Box,
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  TablePagination,
  Checkbox,
  Radio,
  FormControlLabel
} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axiosInstance from 'config/AxiosInstanceAdmin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'components/Loader';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
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
const AddForm = () => {
  //add form
  const [loading, setLoading] = useState(true);
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;

  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState({
    admin_id: loggedInUserId,
    formName: '',
    fields: []
  });

  const [newField, setNewField] = useState({
    fieldName: '',
    fieldType: 'text',
    options: [] // New property for radio and checkbox options
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddField = () => {
    if (newField.fieldName.trim() === '') {
      toast.error('Field Name is required');
      return;
    }

    setFormData({
      ...formData,
      fields: [...formData.fields, newField]
    });
    setNewField({ fieldName: '', fieldType: 'text' });
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...formData.fields];
    updatedFields.splice(index, 1);
    setFormData({
      ...formData,
      fields: updatedFields
    });
  };

  const handleSave = async () => {
    try {
      const updatedFormData = {
        ...formData,
        project_id: selectedProjectId,
        projectName: projects.find((project) => project.project_id === selectedProjectId)?.projectName || ''
      };

      const response = await axiosInstance.post('/addreportingfrom/addform', updatedFormData);
      console.log('response', response)
      const newFormId = response.data.form.form_id;

      if (newFormId) {
        const notificationData = {
          projectId: selectedProjectId,
          formId: newFormId,
          actionType: 'add',
          adminId: loggedInUserId
        };

        await axiosInstance.post('/notification/formnotifications', notificationData);

        toast.success('Form added successfully');
      } else {
        toast.error('Form added but could not retrieve form ID for notification.');
      }

      handleCloseDialog();
      getAdminForms();
    } catch (error) {
      console.error('Error adding form:', error);
      toast.error('Error adding form');
    }
  };

  const isSaveDisabled = formData.fields.length === 0;

  //get all forms
  const [adminForms, setAdminForms] = useState([]);

  const getAdminForms = async () => {
    try {
      const response = await axiosInstance.get(`/addreportingfrom/getforms/${loggedInUserId}`);
      setAdminForms(response.data.forms);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdminForms();
  }, [loggedInUserId]);

  //delete form
  const [formToDelete, setFormToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteForm = (formId) => {
    const formToDelete = adminForms.find((form) => form.form_id === formId);
    setFormToDelete(formToDelete);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/addreportingfrom/deleteform/${formToDelete.form_id}`);
      toast.success('Form deleted successfully');
      const updatedForms = adminForms.filter((form) => form.form_id !== formToDelete.form_id);
      setAdminForms(updatedForms);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Error deleting form');
    }
  };

  const handleCloseDeleteDialog = () => {
    setFormToDelete(null);
    setOpenDeleteDialog(false);
  };

  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    filteredForms;
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //searchbaar
  const [searchQuery, setSearchQuery] = useState('');

  const filteredForms = adminForms.filter((from) => from.formName.toLowerCase().includes(searchQuery.toLowerCase()));

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Step 2: Fetch Projects Data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get(`/addprojects/projects/names/${loggedInUserId}`); // Adjust the URL as per your API.
        setProjects(response.data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // toast.error('Error fetching projects');
      }
    };

    fetchProjects();
  }, []);

  const navigate = useNavigate(); // Create the navigate function

  // ... (existing code)

  const handleEditForm = (formId) => {
    // Use navigate to redirect to the edit form page, you need to define your route for editing
    navigate(`/admin/editform/${formId}`);
  };

  return (
    <>
      {loading && (
        <div style={fullScreenLoaderStyle}>
          <Loader />
        </div>
      )}
      <div style={loading ? { display: 'none' } : {}}>
        <Grid container spacing={3} style={{ paddingTop: '25px' }}>
          <>
            <Grid item xs={12}>
              <>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" gutterBottom>
                      Add New Form
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenDialog}
                      style={{ backgroundColor: 'rgba(71, 121, 126, 1)' }}
                    >
                      Add Form
                    </Button>
                  </Grid>
                  <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                    <DialogTitle style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'rgba(255,255,255)', fontSize: '20px' }}>
                      Add New Form
                    </DialogTitle>
                    <DialogContent>
                      <form style={{ paddingTop: '20px' }}>
                        <TextField
                          select
                          fullWidth
                          label="Select Project"
                          variant="outlined"
                          name="selectedProjectId"
                          value={selectedProjectId}
                          onChange={(e) => setSelectedProjectId(e.target.value)}
                          style={{ marginTop: '20px' }}
                        >
                          {projects?.map((project) => (
                            <MenuItem key={project.project_id} value={project.project_id}>
                              {project.projectName}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          fullWidth
                          label="Form Name"
                          variant="outlined"
                          name="formName"
                          value={formData.formName}
                          onChange={handleChange}
                          style={{ marginTop: '15px' }}
                        />
                        <Typography variant="h6" style={{ paddingTop: '15px' }}>
                          Form Fields:
                        </Typography>
                        {formData.fields.length > 0 && (
                          <Paper elevation={3} style={{ padding: '15px', borderRadius: '10px' }}>
                            {formData.fields.map((field, index) => (
                              <Grid container spacing={2} key={index}>
                                <Grid item xs={6}>
                                  <Typography variant="subtitle1">{field.fieldName}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography variant="subtitle1" style={{ color: 'rgba(71, 121, 126, 1)', marginRight: '8px' }}>
                                    {field.fieldType}
                                  </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                  <IconButton onClick={() => handleRemoveField(index)}>
                                    <CloseOutlined style={{ color: 'red', paddingBottom: '10px' }} />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            ))}
                          </Paper>
                        )}

                        <TextField
                          fullWidth
                          label="Field Name"
                          variant="outlined"
                          name="fieldName"
                          value={newField.fieldName}
                          onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })}
                          style={{ marginTop: '15px' }}
                        />
                        <TextField
                          select
                          fullWidth
                          label="Field Type"
                          variant="outlined"
                          name="fieldType"
                          value={newField.fieldType}
                          onChange={(e) => setNewField({ ...newField, fieldType: e.target.value })}
                          style={{ marginTop: '20px' }}
                        >
                          <MenuItem value="text">Text</MenuItem>
                          {/* <MenuItem value="textarea">Textarea</MenuItem> */}
                          <MenuItem value="date">Date</MenuItem>
                          <MenuItem value="checkbox">Checkbox</MenuItem>
                          <MenuItem value="radio">Radio</MenuItem>
                        </TextField>
                        {newField.fieldType === 'radio' || newField.fieldType === 'checkbox' ? (
                          <div>
                            <TextField
                              fullWidth
                              label="Options(comma-seprated)"
                              variant="outlined"
                              name="options"
                              value={newField.options ? newField.options.join(',') : ''}
                              onChange={(e) => setNewField({ ...newField, options: e.target.value.split(',') })}
                              style={{ marginTop: '15px' }}
                            />
                            <div style={{ marginTop: '10px' }}>
                              {newField.fieldType === 'radio' && newField.options
                                ? newField.options.map((option, index) => (
                                    <FormControlLabel key={index} control={<Radio />} label={option} />
                                  ))
                                : newField.fieldType === 'checkbox' && newField.options
                                ? newField.options.map((option, index) => (
                                    <FormControlLabel key={index} control={<Checkbox />} label={option} />
                                  ))
                                : null}
                            </div>
                          </div>
                        ) : null}

                        <Button onClick={handleAddField} style={{ marginTop: '20px', color: 'rgba(71, 121, 126, 1)' }}>
                          Add Field
                        </Button>
                      </form>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        color="primary"
                        variant="contained"
                        style={{ backgroundColor: 'rgba(71, 121, 126, 1)' }}
                        disabled={isSaveDisabled}
                      >
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ marginTop: '10px' }}
                />
              </>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper} style={{ paddingTop: '5px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px',
                          backgroundColor: 'rgba(71, 121, 126, 1)',
                          color: 'white'
                        }}
                      >
                        Form Name
                      </TableCell>
                      <TableCell
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px',
                          backgroundColor: 'rgba(71, 121, 126, 1)',
                          color: 'white'
                        }}
                      >
                        Project
                      </TableCell>
                      {/* <TableCell
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px',
                          backgroundColor: 'rgba(71, 121, 126, 1)',
                          color: 'white'
                        }}
                      >
                        Fields
                      </TableCell> */}
                      <TableCell
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px',
                          backgroundColor: 'rgba(71, 121, 126, 1)',
                          color: 'white'
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0 ? filteredForms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : users).length > 0 ? (
                      (rowsPerPage > 0 ? filteredForms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : users).map((form) => (
                        <TableRow key={form._id}>
                          <TableCell>
                            {' '}
                            <div
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '200px'
                              }}
                            >
                              {form.formName}{' '}
                            </div>
                          </TableCell>
                          <TableCell>
                            {' '}
                            <div
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '200px'
                              }}
                            >
                              {form.projectName}{' '}
                            </div>
                          </TableCell>
                          {/* <TableCell>
                            {form.fields.map((field, index) => (
                              <div
                                key={index}
                                style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '200px'
                                }}
                              >
                                {field.fieldName} - {field.fieldType}
                              </div>
                            ))}
                          </TableCell> */}
                          <TableCell>
                            <div
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '200px'
                              }}
                            >
                              <IconButton onClick={() => handleDeleteForm(form.form_id)}>
                                <DeleteIcon />
                              </IconButton>
                              <IconButton onClick={() => handleEditForm(form.form_id)}>
                                {/* Use handleEditForm to navigate to the edit form page */}
                                <EditIcon />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                          No forms available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredForms.length}
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
            </Grid>

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>Are you sure you want to delete the {formToDelete?.formName}?</DialogContent>
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
          </>
        </Grid>
      </div>
    </>
  );
};

export default AddForm;
