import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from 'config/AxiosInstanceAdmin';
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
  MenuItem,
  TablePagination,
  ListItemText,
  Checkbox
} from '@mui/material';
import Loader from 'components/Loader';
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
const AddUser = () => {
  //loader
  const [loading, setLoading] = useState(true);

  //fetch project and user
  const [projects, setProjects] = useState([]);
  const [users, setusers] = useState([]);
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/addusers/getuserbyadmin/${loggedInUserId}`);
      setusers(response.data.users);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get(`/addprojects/projects/names/${loggedInUserId}`);
      setProjects(response.data.data);

      // Set the selected project in the edit dialog
      const selectedProject = response.data.data.find((p) => p.project_id === selectedEditProject);
      if (selectedProject) {
        setEditFormData({
          ...editFormData,
          project_id: selectedProject.project_id,
          projectName: selectedProject.projectName
        });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectChange = (event) => {
    const selectedProjectIds = event.target.value;
    const selectedProjects = projects.filter((p) => selectedProjectIds.includes(p.project_id));

    // Assuming you want to store an array of project names in projectName
    const selectedProjectNames = selectedProjects.map((project) => project.projectName);

    setFormData({
      ...formData,
      project_ids: selectedProjectIds, // Assuming your formData has a field for storing project_ids as an array
      projectName: selectedProjectNames.join(', ') // Join project names into a string if needed
    });
  };

  //add new user
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    email: '',
    phonenumber: '',
    password: '',
    admin_id: loggedInUserId,
    project_ids: []
  });

  const handleSave = async () => {
    try {
      await axiosInstance.post('/addusers/adduser', formData);
      toast.success('User added successfully');
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding user:', error);
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
        toast.error('Error adding user');
      }
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

  //change status

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  //delete user
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

  //edit admin data
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    email: '',
    phonenumber: '',
    password: '',
    project_ids: [] // Initialize project_ids as an empty array
  });
  // const [selectedEditProjects, setSelectedEditProjects] = useState([]);

  const promptEditAdmin = (user) => {
    setEditFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      companyname: user.companyname,
      email: user.email,
      phonenumber: user.phonenumber,
      project_ids: user.project_ids || [] // Ensure project_ids is an array
    });

    // setSelectedEditProjects(user.project_ids || []); // Set the selected projects
    setEditDialogOpen(true);
    setSelectedUser(user);
  };

  const handleEditSave = async () => {
    try {
      await axiosInstance.put(`/addusers/edituser/${selectedUser?.user_id}`, {
        ...editFormData,
        project_ids: editFormData.project_ids || [] // Ensure project_ids is an array
      });
      toast.success('User updated successfully');
      fetchUsers(); // Refresh the admin list
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user');
    }
  };

  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    filteredUsers;
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //searchbaar
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(
    (user) =>
      user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phonenumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const [selectedEditProject, setSelectedEditProject] = useState(null);
  // const [selectedProjects, setSelectedProjects] = useState([]);
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
            <Box>
              <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>
                  All User
                </Typography>
                <Button variant="contained" style={{ backgroundColor: 'rgba(71, 121, 126, 1)' }} onClick={handleOpenDialog}>
                  Add User
                </Button>
              </Grid>
              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'rgba(255,255,255)', fontSize: '20px' }}>
                  Add User
                </DialogTitle>
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
                          label="Projects"
                          value={formData.project_ids}
                          onChange={handleProjectChange}
                          variant="outlined"
                          SelectProps={{
                            multiple: true,
                            renderValue: (selected) =>
                              selected.map((value) => projects.find((p) => p.project_id === value)?.projectName).join(', ')
                          }}
                        >
                          {projects.map((project) => (
                            <MenuItem key={project.project_id} value={project.project_id}>
                              <Checkbox checked={formData.project_ids.includes(project.project_id)} />
                              <ListItemText primary={project.projectName} />
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
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ marginTop: '10px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '120px',
                          backgroundColor: 'rgba(71, 121, 126, 1)',
                          color: 'white'
                        }}
                      >
                        First Name
                      </TableCell>
                      <TableCell
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '120px',
                          backgroundColor: 'rgba(71, 121, 126, 1)',
                          color: 'white'
                        }}
                      >
                        Last Name
                      </TableCell>
                      <TableCell
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '120px',
                          backgroundColor: 'rgba(71, 121, 126, 1)',
                          color: 'white'
                        }}
                      >
                        Project Name
                      </TableCell>
                      <TableCell
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '120px',
                          backgroundColor: 'rgba(71, 121, 126, 1)',
                          color: 'white'
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '120px',
                          backgroundColor: 'rgba(71, 121, 126, 1)',
                          color: 'white'
                        }}
                      >
                        Phone Number
                      </TableCell>
                      <TableCell
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '120px',
                          backgroundColor: 'rgba(71, 121, 126, 1)',
                          color: 'white'
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '120px',
                          backgroundColor: 'rgba(71, 121, 126, 1)',
                          color: 'white'
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(rowsPerPage > 0 ? filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : admins).length > 0 ? (
                      (rowsPerPage > 0 ? filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : admins).map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{user.firstname}</TableCell>
                          <TableCell>{user.lastname}</TableCell>
                          <TableCell>
                            {user.projectName.split(',').map((projectName, index) => (
                              <div
                                key={index}
                                style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '200px' // Adjust the maxWidth to fit your design needs
                                }}
                              >
                                {projectName.trim()}
                              </div>
                            ))}
                          </TableCell>

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
                            <IconButton onClick={() => promptEditAdmin(user)}>
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} style={{ textAlign: 'center' }}>
                          No users available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
            <TablePagination
              component="div"
              count={users.length}
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
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
            <DialogTitle style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'rgba(255,255,255)', fontSize: '20px' }}>
              Edit User
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} style={{ paddingTop: '20px' }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    name="firstname"
                    value={editFormData.firstname}
                    onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    name="lastname"
                    value={editFormData.lastname}
                    onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    variant="outlined"
                    name="companyname"
                    value={editFormData.companyname}
                    onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    name="phonenumber"
                    value={editFormData.phonenumber}
                    onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Projects"
                    value={editFormData.project_ids}
                    onChange={(event) => {
                      setEditFormData({
                        ...editFormData,
                        project_ids: event.target.value,
                        projectName: event.target.value
                          .map((projectId) => projects.find((p) => p.project_id === projectId)?.projectName || '')
                          .join(', ')
                      });
                    }}
                    variant="outlined"
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected) =>
                        selected.map((value) => projects.find((p) => p.project_id === value)?.projectName).join(', ')
                    }}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.project_id} value={project.project_id}>
                        <Checkbox checked={editFormData.project_ids.includes(project.project_id)} />
                        <ListItemText primary={project.projectName} />
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)} style={{ color: 'black' }}>
                Cancel
              </Button>
              <Button onClick={handleEditSave} style={{ backgroundColor: 'rgba(71, 121, 126)', color: 'white' }}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </div>
    </>
  );
};

export default AddUser;
