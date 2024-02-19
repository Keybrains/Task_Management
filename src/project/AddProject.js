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
  FormControl,
  ListItemText,
  Checkbox,
  ListItemIcon,
  ListItem,
  List
} from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Avatar, Chip } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'components/Loader';
import { IconButton, Menu } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@material-ui/icons/Person';
// import EmailIcon from '@material-ui/icons/Email';
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
      const response = await axiosInstance.get(`/addprojects/projects-with-user/${loggedInUserId}`);
      setProjects(response.data.data);
      console.log('response.data.data', response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [loggedInUserId]);

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
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: '0 6px 16px 0 rgba(0,0,0,0.2)'
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
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error deleting project');
    }
    handleCloseDeleteDialog();
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const handleOpenEditDialog = (projectId) => {
    const projectToEdit = projects.find((project) => project.project_id === projectId);
    if (projectToEdit) {
      setCurrentProject(projectToEdit);
      setFormData({
        projectName: projectToEdit.projectName,
        projectShortName: projectToEdit.projectShortName,
        priority: projectToEdit.priority,
        description: projectToEdit.description,
        startDate: projectToEdit.startDate,
        endDate: projectToEdit.endDate
      });
      setSelectedProjectId(projectId);
      setOpenEditDialog(true);
    } else {
      console.error('Project not found!');
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentProject(null);
    setFormData({
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

  const [allUsers, setAllUsers] = useState([]);
  const [openUserAssignmentDialog, setOpenUserAssignmentDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/addusers/getuserbyadmin/${loggedInUserId}`);
      setAllUsers(response.data.users);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenUserAssignmentDialog = async (projectId) => {
    setSelectedProjectId(projectId);
    const project = projects.find((project) => project.project_id === projectId);
    if (project) {
      const associatedUserIds = project.users.map((user) => user.user_id);
      setSelectedUsers(associatedUserIds);
      setInitialSelectedUsers([...associatedUserIds]);
    }
    setOpenUserAssignmentDialog(true);
    await fetchUsers();
  };

  const handleCloseUserAssignmentDialog = () => {
    setOpenUserAssignmentDialog(false);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const [initialSelectedUsers, setInitialSelectedUsers] = useState([]);

  const handleSaveUserAssignments = async () => {
    const usersToAdd = selectedUsers.filter((userId) => !initialSelectedUsers.includes(userId));
    const usersToRemove = initialSelectedUsers.filter((userId) => !selectedUsers.includes(userId));

    try {
      await Promise.all([
        ...usersToAdd.map((userId) =>
          axiosInstance.put(`/addusers/updateuserprojects/${userId}`, {
            addProjectIds: [selectedProjectId],
            removeProjectIds: []
          })
        ),
        ...usersToRemove.map((userId) =>
          axiosInstance.put(`/addusers/updateuserprojects/${userId}`, {
            addProjectIds: [],
            removeProjectIds: [selectedProjectId]
          })
        )
      ]);

      // After successful update, send notifications
      // For added users
      usersToAdd.forEach((userId) => {
        sendNotification(userId, 'add', selectedProjectId);
      });

      // For removed users
      usersToRemove.forEach((userId) => {
        sendNotification(userId, 'remove', selectedProjectId);
      });

      toast.success('User project assignments updated successfully');
      handleCloseUserAssignmentDialog();
      setInitialSelectedUsers(selectedUsers);
      fetchProjects();
      fetchUsers();
    } catch (error) {
      console.error('Error updating user projects:', error);
      toast.error('Error updating user projects');
    }
  };

  // Function to send notifications
  const sendNotification = async (userId, actionType, projectId) => {
    try {
      const notificationData = {
        userId,
        projectId,
        actionType,
        adminId: loggedInUserId
      };
      await axiosInstance.post('/notification/notifications', notificationData);
      console.log('notificationData', notificationData);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    setFilteredUsers(allUsers.filter((user) => `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, allUsers]);

  const handleTimeFrameChange = async (event) => {
    const timeFrame = event.target.value;
    downloadReport(timeFrame);
  };

  const downloadReport = async (timeFrame) => {
    try {
      const response = await axiosInstance.get(`/addtasks/tasks/summary/${loggedInUserId}`, {
        params: { timeFrame }
      });
      const projects = response.data;

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const filteredProjects = projects
        .map((project) => {
          const filteredUsers = project.users
            .map((user) => {
              const filteredTasks = user.tasks.filter((task) => {
                const taskDate = new Date(task.createAt);
                taskDate.setHours(0, 0, 0, 0);
                switch (timeFrame) {
                  case 'today':
                    return taskDate.getTime() === currentDate.getTime();
                  case '7days':
                    return currentDate.getTime() - taskDate.getTime() < 7 * 24 * 60 * 60 * 1000;
                  case '30days':
                    return currentDate.getTime() - taskDate.getTime() < 30 * 24 * 60 * 60 * 1000;
                  default:
                    return true;
                }
              });
              return { ...user, tasks: filteredTasks };
            })
            .filter((user) => user.tasks.length > 0);
          return { ...project, users: filteredUsers };
        })
        .filter((project) => project.users.length > 0);

      let excelData = [];

      filteredProjects.forEach((project) => {
        excelData.push({
          'Project Name': project.projectName,
          Username: '',
          Field: '',
          Value: ''
        });

        project.users.forEach((user) => {
          excelData.push({
            'Project Name': '',
            Username: `${user.firstName} ${user.lastName}`,
            Field: '',
            Value: ''
          });

          user.tasks.forEach((task) => {
            Object.entries(task.formFields).forEach(([field, value]) => {
              let fieldValue = Array.isArray(value) ? value.join(', ') : value;
              excelData.push({
                'Project Name': '',
                Username: '',
                Field: field,
                Value: fieldValue
              });
            });
          });
        });
      });

      const ws = XLSX.utils.json_to_sheet(excelData);

      const colWidths = excelData.reduce((widths, row) => {
        Object.keys(row).forEach((key, index) => {
          const contentLength = row[key] ? row[key].toString().length : 0;
          widths[index] = Math.max(widths[index] || 10, contentLength);
        });
        return widths;
      }, []);

      ws['!cols'] = colWidths.map((w) => ({ wch: w + 2 }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Projects Report');

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
      saveAs(data, 'ProjectsReport.xlsx');
    } catch (error) {
      console.error('Error downloading the report:', error);
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
          <Grid
            container
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
            style={{ paddingLeft: '30px', paddingTop: '25px' }}
          >
            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                Add New Project
              </Typography>
            </Grid>
            <Grid item container xs={12} md={8} spacing={3} justifyContent="flex-end">
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <FormControl fullWidth>
                  <InputLabel id="timeFrame-label">Select Time Frame</InputLabel>
                  <Select
                    labelId="timeFrame-label"
                    id="timeFrame"
                    onChange={handleTimeFrameChange}
                    label="Select Time Frame"
                    defaultValue=""
                  >
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="7days">Last 7 Days</MenuItem>
                    <MenuItem value="30days">Last 30 Days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenDialog}
                  style={{ backgroundColor: 'rgba(71, 121, 126, 1)' }}
                  fullWidth
                >
                  Add Project
                </Button>
              </Grid>
            </Grid>
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
          </Grid>
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
                        <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#4a90e2', letterSpacing: '0.5px' }}>
                          {project.projectName}
                        </Typography>
                        <IconButton
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={(event) => handleMenuClick(event, project.project_id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                          <MenuItem
                            onClick={() => {
                              handleOpenEditDialog(selectedProjectId);
                              handleMenuClose();
                            }}
                          >
                            Edit
                          </MenuItem>

                          <MenuItem
                            onClick={() => {
                              handleOpenUserAssignmentDialog(selectedProjectId); // And he
                              handleMenuClose();
                            }}
                          >
                            Manage User
                          </MenuItem>

                          <MenuItem
                            onClick={() => {
                              handleOpenDeleteDialog(selectedProjectId); // And he
                              handleMenuClose();
                            }}
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </Box>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <ShortText style={{ marginRight: '4px' }} />
                        <Typography variant="body1">{project.projectShortName}</Typography>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <Flag style={{ marginRight: '4px', color: getColorForPriority(project.priority) }} />
                        <Typography variant="body1" style={{ color: getColorForPriority(project.priority) }}>
                          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                        </Typography>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <CalendarToday style={{ marginRight: '4px' }} />
                        <Typography variant="body1">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </Typography>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <Description style={{ marginRight: '4px', marginTop: '4px' }} />
                        <Typography variant="body2" color="textSecondary" style={{ marginRight: '4px', marginTop: '10px' }}>
                          {project.description}
                        </Typography>
                      </div>
                      {project.users && project.users.length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Associated Users:
                          </Typography>
                          {project.users.map((user, userIndex) => (
                            <Chip
                              key={userIndex}
                              avatar={
                                <Avatar>
                                  <PersonIcon />
                                </Avatar>
                              }
                              label={`${user.firstname} ${user.lastname}`}
                              variant="outlined"
                              color="primary"
                              size="small"
                              style={{ padding: '15px', margin: '1px' }}
                            />
                          ))}
                        </div>
                      )}
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
            <Button onClick={handleEditSave} style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'rgba(255,255,255)' }}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openUserAssignmentDialog} onClose={handleCloseUserAssignmentDialog} maxWidth="sm" fullWidth>
          <DialogTitle style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            Assign Users
          </DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: '10px', fontSize: '16px', color: 'rgba(0, 0, 0, 0.6)', fontWeight: 'bold', marginLeft: '5px' }}>
              <p>You can assign or unassign any user by checking or unchecking the box next to their name.</p>
            </div>
            <TextField
              margin="dense"
              variant="outlined"
              fullWidth
              label="Search Users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '20px' }}
            />

            <List
              subheader={
                <Typography style={{ fontSize: '18px', color: 'rgba(0, 0, 0, 0.87)', fontWeight: 'bold' }}>
                  Current assigned user(s)
                </Typography>
              }
            >
              {filteredUsers.filter((user) => selectedUsers.includes(user.user_id)).length > 0 ? (
                filteredUsers
                  .filter((user) => selectedUsers.includes(user.user_id))
                  .map((user) => (
                    <ListItem key={user.user_id} button onClick={() => handleSelectUser(user.user_id)}>
                      <ListItemIcon>
                        <Checkbox edge="start" checked tabIndex={-1} disableRipple style={{ color: 'rgba(71, 121, 126, 1)' }} />
                      </ListItemIcon>
                      <ListItemText primary={`${user.firstname} ${user.lastname}`} style={{ marginLeft: '10px' }} />
                    </ListItem>
                  ))
              ) : (
                <ListItem>
                  <ListItemText primary="No assigned users" />
                </ListItem>
              )}
            </List>

            <List
              subheader={
                <Typography style={{ fontSize: '18px', color: 'rgba(0, 0, 0, 0.87)', fontWeight: 'bold' }}>
                  Choose user(s) to assign to this project
                </Typography>
              }
            >
              {filteredUsers.filter((user) => !selectedUsers.includes(user.user_id)).length > 0 ? (
                filteredUsers
                  .filter((user) => !selectedUsers.includes(user.user_id))
                  .map((user) => (
                    <ListItem key={user.user_id} button onClick={() => handleSelectUser(user.user_id)}>
                      <ListItemIcon>
                        <Checkbox edge="start" checked={false} tabIndex={-1} disableRipple style={{ color: 'grey' }} />
                      </ListItemIcon>
                      <ListItemText primary={`${user.firstname} ${user.lastname}`} style={{ marginLeft: '10px' }} />
                    </ListItem>
                  ))
              ) : (
                <ListItem>
                  <ListItemText primary="No unassigned users" />
                </ListItem>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUserAssignmentDialog} style={{ color: 'rgba(71, 121, 126, 1)' }}>
              Cancel
            </Button>
            <Button onClick={handleSaveUserAssignments} style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default AddProject;
