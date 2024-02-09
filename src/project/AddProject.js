import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from 'config/AxiosInstanceAdmin';
import { Flag, ShortText, Description, CalendarToday } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Card,
  CardContent,
  DialogContentText,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'components/Loader';
import { IconButton, Menu } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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
const AddProject = () => {
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;
  const [formData, setFormData] = useState({
    admin_id: loggedInUserId,
    projectName: '',
    projectShortName: '',
    priority: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post('/addprojects/addproject', formData);
      toast.success('Project added successfully');
      handleCloseDialog();
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Error adding project');
    }
  };

  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get(`/addprojects/projects/${loggedInUserId}`);
      setProjects(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
      // toast.error('Error fetching projects');
    }
  };
  useEffect(() => {
    fetchProjects();
  }, [loggedInUserId]); // Include loggedInUserId in the dependency array

  const getColorForPriority = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'black';
    }
  };

  const getProjectCardStyle = (priority) => ({
    margin: '10px',
    backgroundColor: '#ffffff', // Light background
    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)', // Softer shadow
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth transition for hover effect
    '&:hover': {
      transform: 'scale(1.03)', // Slightly enlarge on hover
      boxShadow: '0 6px 16px 0 rgba(0,0,0,0.2)' // Increase shadow on hover
    },
    borderTop: `4px solid ${getColorForPriority(priority)}`
  });

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const handleMenuClick = (event, projectId) => {
    setAnchorEl(event.currentTarget);
    setSelectedProjectId(projectId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await axiosInstance.delete(`/addprojects/deleteproject/${projectId}`);
      toast.success('Project deleted successfully');
      fetchProjects(); // Refresh the list of projects
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error deleting project');
    }
    handleCloseDeleteDialog(); // Close the confirmation dialog
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState(null); // To store the project being edited

  // Open edit dialog with project data
  const handleOpenEditDialog = (project) => {
    setFormData({
      admin_id: loggedInUserId,
      projectName: project.projectName,
      projectShortName: project.projectShortName,
      priority: project.priority,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate
    });
    setCurrentProject(project); // Set current project for editing
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentProject(null); // Reset current project
    setFormData({
      // Reset form data or adjust according to your needs
      admin_id: loggedInUserId,
      projectName: '',
      projectShortName: '',
      priority: '',
      description: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleEditSave = async () => {
    try {
      await axiosInstance.put(`/addprojects/editproject/${currentProject.project_id}`, formData);
      toast.success('Project updated successfully');
      handleCloseEditDialog();
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Error updating project');
    }
  };
  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  return (
    <>
      {loading && (
        <div style={fullScreenLoaderStyle}>
          <Loader />
        </div>
      )}
      <div style={loading ? { display: 'none' } : {}}>
        <Grid container spacing={3} style={{ paddingTop: '15px' }}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" gutterBottom>
                Add New Project
              </Typography>
              <Button variant="contained" color="primary" onClick={handleOpenDialog} style={{ backgroundColor: 'rgba(71, 121, 126, 1)' }}>
                Add Project
              </Button>
              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'rgba(255,255,255)', fontSize: '20px' }}>
                  Add New Project
                </DialogTitle>
                <DialogContent>
                  <form style={{ paddingTop: '10px' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Project Name"
                          variant="outlined"
                          name="projectName"
                          value={formData.projectName}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Short Name"
                          variant="outlined"
                          name="projectShortName"
                          value={formData.projectShortName}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          select
                          fullWidth
                          label="Priority"
                          variant="outlined"
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                        >
                          <MenuItem value="high">High</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="low">Low</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          variant="outlined"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          multiline
                          rows={4}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Start Date"
                          variant="outlined"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="End Date"
                          variant="outlined"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="secondary">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} color="primary" variant="contained" style={{ backgroundColor: 'rgba(71, 121, 126, 1)' }}>
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom style={{ marginLeft: '10px' }}>
              All Projects
            </Typography>
            <Grid container spacing={2}>
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card style={getProjectCardStyle(project.priority)}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          {/* Project Name */}
                          <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#4a90e2', letterSpacing: '0.5px' }}>
                            {project.projectName}
                          </Typography>
                          <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={(event) => handleMenuClick(event, project.project_id)} // Assume project._id is your identifier
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={() => handleOpenEditDialog(project)}>Edit</MenuItem>
                            <MenuItem onClick={handleOpenDeleteDialog}>Delete</MenuItem>
                          </Menu>
                        </Box>
                        {/* Project Short Name */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <ShortText style={{ marginRight: '4px' }} />
                          <Typography variant="body1">{project.projectShortName}</Typography>
                        </div>

                        {/* Project Priority */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <Flag style={{ marginRight: '4px', color: getColorForPriority(project.priority) }} />
                          <Typography variant="body1" style={{ color: getColorForPriority(project.priority) }}>
                            {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                          </Typography>
                        </div>

                        {/* Project Dates */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <CalendarToday style={{ marginRight: '4px' }} />
                          <Typography variant="body1">
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                          </Typography>
                        </div>

                        {/* Project Description */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <Description style={{ marginRight: '4px', marginTop: '4px' }} />
                          <Typography variant="body2" color="textSecondary" style={{ marginRight: '4px', marginTop: '10px' }}>
                            {project.description}
                          </Typography>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" style={{ textAlign: 'center' }}>
                    No projects available.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Are you sure you want to delete this project?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleDeleteProject(selectedProjectId)} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
          <DialogTitle style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'rgba(255,255,255)', fontSize: '20px' }}>
            Edit Project
          </DialogTitle>
          <DialogContent style={{ marginTop: '30px' }}>
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="projectName"
                    label="Project Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    id="projectShortName"
                    label="Project Short Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.projectShortName}
                    onChange={(e) => setFormData({ ...formData, projectShortName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="priority-select-label">Priority</InputLabel>
                    <Select
                      labelId="priority-select-label"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      label="Priority"
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    id="startDate"
                    label="Start Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    id="endDate"
                    label="End Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'rgba(255,255,255)' }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default AddProject;
