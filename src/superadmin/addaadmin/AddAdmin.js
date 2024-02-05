import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from 'superadmin/config/AxiosInstanceSuperAdmin';
import Loader from 'superadmin/components/Loader';
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
  TablePagination
} from '@mui/material';

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

const AddAdmin = () => {
  //loader
  const [loading, setLoading] = useState(false);

  //add new admin
  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    email: '',
    phonenumber: '',
    password: ''
  });

  const handleSave = async () => {
    try {
      await axiosInstance.post('/addadmins/addadmin', formData);
      toast.success('Admin added successfully');
      fetchAdmins();
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding admin:', error);
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
        toast.error('Error adding admin');
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

  //get all admins
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/addadmins/getadmins');
      setAdmins(response.data.admins);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  //change status
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

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

  //delete admin
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

  //edit admin data
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    email: '',
    phonenumber: '',
    password: ''
  });

  const promptEditAdmin = (admin) => {
    setEditFormData({
      firstname: admin.firstname,
      lastname: admin.lastname,
      companyname: admin.companyname,
      email: admin.email,
      phonenumber: admin.phonenumber
      // Avoid pre-filling the password for security reasons
    });
    setEditDialogOpen(true);
    setSelectedAdmin(admin);
  };

  const handleEditSave = async () => {
    try {
      await axiosInstance.put(`/addadmins/editadmin/${selectedAdmin?.user_id}`, editFormData);
      toast.success('Admin updated successfully');
      fetchAdmins(); // Refresh the admin list
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Error updating admin');
    }
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

  //searchbaar
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.phonenumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {loading && (
        <div style={fullScreenLoaderStyle}>
          <Loader />
        </div>
      )}
      <div style={loading ? { display: 'none' } : {}}>
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
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ backgroundColor: 'rgba(255, 200, 150)' }}>First Name</TableCell>
                    <TableCell style={{ backgroundColor: 'rgba(255, 200, 150)' }}>Last Name</TableCell>
                    <TableCell style={{ backgroundColor: 'rgba(255, 200, 150)' }}>Email</TableCell>
                    <TableCell style={{ backgroundColor: 'rgba(255, 200, 150)' }}>Phone Number</TableCell>
                    <TableCell style={{ backgroundColor: 'rgba(255, 200, 150)' }}>Status</TableCell>
                    <TableCell style={{ backgroundColor: 'rgba(255, 200, 150)' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAdmins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No admins found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAdmins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((admin) => (
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
                          <IconButton onClick={() => promptEditAdmin(admin)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={admins.length}
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
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} style={{ paddingTop: '10px' }}>
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
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)} style={{ color: 'black' }}>
                Cancel
              </Button>
              <Button onClick={handleEditSave} style={{ backgroundColor: 'rgba(255, 165, 0)', color: 'white' }}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </div>
    </>
  );
};

export default AddAdmin;
