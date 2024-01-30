import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from 'superadmin/config/AxiosInstanceSuperAdmin';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem
} from '@mui/material';
const AddUser = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [users, setusers] = useState([]);
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    email: '',
    phonenumber: '',
    password: '',
    admin_id: loggedInUserId
  });
  const [projects, setProjects] = useState([]);
  //   const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchProjects(); // Fetch projects on component mount
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/addusers/getuserbyadmin/${loggedInUserId}`);
      setusers(response.data.users);
      console.log('response.data.users', response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post('/addusers/adduser', formData);

      // Display success toast
      toast.success('User added successfully');

      // After saving, fetch the updated list of users
      fetchUsers();

      handleCloseDialog();
    } catch (error) {
      console.error('Error adding user:', error);

      // Check for specific HTTP status codes
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.message;

        switch (status) {
          case 401:
            toast.error('Email already exists');
            break;
          case 402:
            toast.error('Phone number already exists');
            break;
          default:
            toast.error(errorMessage || 'Error adding user');
        }
      } else {
        // Display a general error toast if the error structure is unknown
        toast.error('Error adding user');
      }
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get(`/addprojects/projects/names/${loggedInUserId}`);
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectChange = (event) => {
    const selectedProjectId = event.target.value;
    const selectedProject = projects.find((p) => p.project_id === selectedProjectId);
    if (selectedProject) {
      setFormData({
        ...formData,
        project_id: selectedProject.project_id,
        projectName: selectedProject.projectName
      });
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'activate' ? 'deactivate' : 'activate';
      await axiosInstance.put(`/addusers/updateuser/${userId}`, { status: newStatus });

      toast.success(`User ${newStatus}d successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Error toggling user status');
    }
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ... (other code)

  const promptToggleStatus = (user) => {
    setSelectedUser(user);
    setConfirmDialogOpen(true);
  };

  const handleStatusChangeConfirm = async () => {
    if (selectedUser) {
      await toggleUserStatus(selectedUser.user_id, selectedUser.status);
      setConfirmDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const promptDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await axiosInstance.delete(`/addusers/deleteuser/${userToDelete.user_id}`);
        toast.success('User deleted successfully');
        fetchUsers();
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error deleting user');
      }
    }
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
            All User
          </Typography>
          <Button variant="contained" style={{ backgroundColor: 'rgba(71, 121, 126, 1)' }} onClick={handleOpenDialog}>
            Add User
          </Button>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle style={{ color: 'rgba(71, 121, 126, 1)', fontSize: '25px' }}>Add User</DialogTitle>
            <DialogContent>
              <form style={{ paddingTop: '10px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      variant="outlined"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company name"
                      variant="outlined"
                      name="companyname"
                      value={formData.companyname}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Email" variant="outlined" name="email" value={formData.email} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Project"
                      value={formData.project_id}
                      onChange={handleProjectChange}
                      variant="outlined"
                    >
                      {projects.map((project) => (
                        <MenuItem key={project.project_id} value={project.project_id}>
                          {project.projectName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      variant="outlined"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      variant="outlined"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} style={{ color: 'black' }}>
                Cancel
              </Button>
              <Button onClick={handleSave} style={{ backgroundColor: 'rgba(71, 121, 126, 1)' }} variant="contained">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }}>First Name</TableCell>
                <TableCell style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }}>Last Name</TableCell>
                <TableCell style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }}>Project Name</TableCell>
                <TableCell style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }}>Email</TableCell>
                <TableCell style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }}>Phone Number</TableCell>
                <TableCell style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }}>Status</TableCell>
                <TableCell style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.firstname}</TableCell>
                  <TableCell>{user.lastname}</TableCell>
                  <TableCell>{user.projectName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phonenumber}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={user.status === 'activate' ? 'success' : 'error'}
                      onClick={() => promptToggleStatus(user)}
                    >
                      {user.status === 'activate' ? 'Active' : 'Inactive'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => promptDeleteUser(user)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          Are you sure you want to {selectedUser?.status === 'activate' ? 'deactivate' : 'activate'} {selectedUser?.firstname}{' '}
          {selectedUser?.lastname}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusChangeConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {userToDelete?.firstname} {userToDelete?.lastname}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default AddUser;
