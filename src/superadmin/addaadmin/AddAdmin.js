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
  Paper
} from '@mui/material';
const AddAdmin = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    email: '',
    phonenumber: '',
    password: ''
  });
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []); // Fetch admins when the component mounts

  const fetchAdmins = async () => {
    try {
      const response = await axiosInstance.get('/addadmins/getadmins');
      setAdmins(response.data.admins);
    } catch (error) {
      console.error('Error fetching admins:', error);
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
      await axiosInstance.post('/addadmins/addadmin', formData);

      // Display success toast
      toast.success('Admin added successfully');

      // After saving, fetch the updated list of admins
      fetchAdmins();

      handleCloseDialog();
    } catch (error) {
      console.error('Error adding admin:', error);

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
            toast.error(errorMessage || 'Error adding admin');
        }
      } else {
        // Display a general error toast if the error structure is unknown
        toast.error('Error adding admin');
      }
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'activate' ? 'deactivate' : 'activate';
      await axiosInstance.put(`/addadmins/togglestatus/${userId}`, { status: newStatus });

      toast.success(`Admin ${newStatus}d successfully`);
      fetchAdmins();
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast.error('Error toggling admin status');
    }
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // ... (other code)

  const promptToggleStatus = (admin) => {
    setSelectedAdmin(admin);
    setConfirmDialogOpen(true);
  };

  const handleStatusChangeConfirm = async () => {
    if (selectedAdmin) {
      await toggleAdminStatus(selectedAdmin.user_id, selectedAdmin.status);
      setConfirmDialogOpen(false);
      setSelectedAdmin(null);
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const promptDeleteAdmin = (admin) => {
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (adminToDelete) {
      try {
        await axiosInstance.delete(`/addadmins/deleteadmin/${adminToDelete.user_id}`);
        toast.success('Admin deleted successfully');
        fetchAdmins();
        setDeleteDialogOpen(false);
        setAdminToDelete(null);
      } catch (error) {
        console.error('Error deleting admin:', error);
        toast.error('Error deleting admin');
      }
    }
  };

  return (
    <Grid container spacing={3}>
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
            All Admin
          </Typography>
          <Button variant="contained" style={{ backgroundColor: 'rgba(255, 165, 0)' }} onClick={handleOpenDialog}>
            Add Admin
          </Button>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle style={{ color: 'rgba(255, 165, 0)', fontSize: '25px' }}>Add Admin</DialogTitle>
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
              <Button onClick={handleSave} style={{ backgroundColor: 'rgba(255, 165, 0)' }} variant="contained">
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
                <TableCell style={{ backgroundColor: 'rgba(255, 200, 150)' }}>First Name</TableCell>
                <TableCell style={{ backgroundColor: 'rgba(255, 200, 150)' }}>Last Name</TableCell>
                <TableCell style={{ backgroundColor: 'rgba(255, 200, 150)' }}>Email</TableCell>
                <TableCell style={{ backgroundColor: 'rgba(255, 200, 150)' }}>Phone Number</TableCell>
                <TableCell style={{ backgroundColor: 'rgba(255, 200, 150)' }}>Status</TableCell>
                <TableCell style={{ backgroundColor: 'rgba(255, 200, 150)' }}>Action</TableCell>
                {/* Add more table headers as needed */}
              </TableRow>
            </TableHead>

            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.firstname}</TableCell>
                  <TableCell>{admin.lastname}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phonenumber}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={admin.status === 'activate' ? 'success' : 'error'}
                      onClick={() => promptToggleStatus(admin)}
                    >
                      {admin.status === 'activate' ? 'Active' : 'Inactive'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => promptDeleteAdmin(admin)}>
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
          Are you sure you want to {selectedAdmin?.status === 'activate' ? 'deactivate' : 'activate'} {selectedAdmin?.firstname}{' '}
          {selectedAdmin?.lastname}?
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
          Are you sure you want to delete {adminToDelete?.firstname} {adminToDelete?.lastname}?
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

export default AddAdmin;
