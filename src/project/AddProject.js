import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from 'superadmin/config/AxiosInstanceSuperAdmin';
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
  CardContent
} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';

const AddProject = () => {
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
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Error adding project');
    }
  };

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get(`/addprojects/projects/${loggedInUserId}`);
        setProjects(response.data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // toast.error('Error fetching projects');
      }
    };

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

  return (
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
            <DialogTitle style={{ color: 'rgba(71, 121, 126, 1)', fontSize: '25px' }}>Add New Project</DialogTitle>
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
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card style={getProjectCardStyle(project.priority)}>
                <CardContent>
                  {/* Project Name */}
                  <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#4a90e2', letterSpacing: '0.5px' }}>
                    {project.projectName}
                  </Typography>

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
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AddProject;
