import React, { useEffect, useState } from 'react';
import axiosInstance from 'user/config/AxiosInstanceUser';
import {
  MenuItem,
  TextField,
  Grid,
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
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'user/components/Loader';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CloudDownload as CloudDownloadIcon, Clear as ClearIcon, DateRange as DateRangeIcon } from '@material-ui/icons';

// Custom styles to enhance the look
const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: 'rgba(71, 121, 126, 1)',
    color: 'rgba(255,255,255)'
  },
  dialogCustom: {
    width: '40%', // Custom width
    height: '50%' // Custom maximum height
  },
  dialogContent: {
    marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  clearDatesButton: {
    borderColor: theme.palette.error.main,
    color: 'rgba(255,114,118)',
    '&:hover': {
      borderColor: theme.palette.error.dark
    }
  },
  downloadButton: {
    borderColor: 'rgba(71, 121, 126, 1)',
    color: 'rgba(71, 121, 126, 1)',
    '&:hover': {
      borderColor: 'rgba(71, 121, 126, 1)',
      backgroundColor: 'transparent'
    }
  }
}));
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

const Reports = () => {
  //lodder
  const [loading, setLoading] = useState(true);

  //get logged user data
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;

  //get user
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/addusers/getuserbyadmin/${loggedInUserId}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //get project
  const [projects, setProjects] = useState([]);
  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get(`/addprojects/projects/${loggedInUserId}`);
      setProjects(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  //get forms
  const [forms, setForms] = useState([]);
  const fetchForms = async (projectId) => {
    try {
      const response = await axiosInstance.get(`/addreportingfrom/getprojectforms/${projectId}`);
      setForms(response.data.forms || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  //fetch task
  const [tasks, setTasks] = useState([]);
  const [selectedTaskProject, setSelectedTaskProject] = useState(null);
  const [selectedTaskForm, setSelectedTaskForm] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchTasks = async (projectId, formId, userId) => {
    try {
      setLoading(true);
      let endpoint = `/addtasks/adminstasks/${loggedInUserId}?`;
      if (projectId) endpoint += `projectId=${projectId}&`;
      if (formId) endpoint += `formId=${formId}&`;
      if (userId) endpoint += `userId=${userId}`;

      const response = await axiosInstance.get(endpoint);

      if (response.data && response.data.length > 0) {
        setTasks(response.data);
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
    if (selectedTaskProject && selectedTaskForm && selectedUserId) {
      fetchTasks(selectedTaskProject, selectedTaskForm, selectedUserId);
    }
  }, [selectedTaskProject, selectedTaskForm, selectedUserId]);

  //get unique fields in all from filter tasks
  const getUniqueFormFields = (filteredTasks) => {
    const uniqueFormFields = new Set();
    filteredTasks.forEach((task) => {
      Object.keys(task.formFields).forEach((key) => uniqueFormFields.add(key));
    });
    return Array.from(uniqueFormFields);
  };
  const filteredTasksByForm = tasks.filter((task) => task.formId === selectedTaskForm);
  const uniqueFormFields = getUniqueFormFields(filteredTasksByForm);

  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    filteredReports;
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //download excel
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const handleCloseDownloadDialog = () => setOpenDownloadDialog(false);
  const handleOpenDownloadDialog = () => setOpenDownloadDialog(true);

  const downloadFilteredData = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filteredData = filteredTasksByForm.filter((task) => {
      const taskDate = new Date(task.createAt);
      return taskDate >= start && taskDate <= end;
    });

    if (filteredData.length === 0) {
      toast.error('No data found for the selected date range.');
      return;
    }
    handleCloseDownloadDialog();
    downloadExcel(filteredData, uniqueFormFields);
  };

  const downloadExcel = (filteredTasksByForm, uniqueFormFields) => {
    const wb = XLSX.utils.book_new();
    const headers = ['Create At', 'User Name', ...uniqueFormFields];
    const ws_data = [headers];
    filteredTasksByForm.forEach((task) => {
      const row = [
        formatDate(task.createAt),
        `${task.userFirstName} ${task.userLastName}`,
        ...uniqueFormFields.map((field) =>
          Array.isArray(task.formFields[field]) ? task.formFields[field].join(', ') : task.formFields[field] || 'N/A'
        )
      ];
      ws_data.push(row);
    });
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const colWidths = headers.map((_, i) =>
      Math.max(...ws_data.map((row) => (row[i] ? String(row[i]).length : 0)), String(headers[i]).length)
    );
    ws['!cols'] = colWidths.map((w) => ({ wch: w + 2 }));
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    XLSX.writeFile(wb, 'reports.xlsx');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  const classes = useStyles();
  return (
    <>
      {loading && (
        <div style={fullScreenLoaderStyle}>
          <Loader />
        </div>
      )}
      <div style={loading ? { display: 'none' } : {}}>
        <Grid container spacing={3} alignItems="center" justifyContent="space-between" style={{ paddingTop: '25px' }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" gutterBottom>
              All Report
            </Typography>
          </Grid>

          <Grid item container xs={12} md={8} spacing={3} justifyContent="flex-end">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                select
                fullWidth
                label="Select Project"
                variant="outlined"
                value={selectedTaskProject || ''}
                onChange={(event) => {
                  const projectId = event.target.value;
                  setSelectedTaskProject(projectId);
                  setSelectedTaskForm(null);
                  setSelectedUserId(null);
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
                label="Select Form"
                variant="outlined"
                value={selectedTaskForm || ''}
                onChange={(event) => setSelectedTaskForm(event.target.value)}
                disabled={!selectedTaskProject}
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
              <TextField
                select
                fullWidth
                label="Select User"
                variant="outlined"
                value={selectedUserId || ''}
                onChange={(event) => setSelectedUserId(event.target.value)}
                disabled={!selectedTaskForm}
              >
                {users.length > 0 ? (
                  users.map((user) => (
                    <MenuItem key={user.user_id} value={user.user_id}>
                      {user.firstname} {user.lastname}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No users available</MenuItem>
                )}
              </TextField>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={3} alignItems="center" style={{ paddingTop: '25px' }}>
          <Grid item xs={12}>
            {selectedTaskProject && selectedTaskForm ? (
              tasks.length > 0 ? (
                <TableContainer component={Paper}>
                  <>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }}>Create At</TableCell>
                          {uniqueFormFields.map((field) => (
                            <TableCell style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }} key={field}>
                              {field}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTasksByForm.length > 0 ? (
                          filteredTasksByForm.map((task) => (
                            <TableRow key={task.taskId}>
                              <TableCell>{formatDate(task.createAt)}</TableCell>
                              {uniqueFormFields.map((field) => (
                                <TableCell key={field}>
                                  {Array.isArray(task.formFields[field])
                                    ? task.formFields[field].join(', ')
                                    : task.formFields[field] || 'N/A'}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={uniqueFormFields.length + 1} align="center">
                              No task available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                      <div style={{ display: 'flex' }}>
                        <FileDownloadIcon onClick={handleOpenDownloadDialog} style={{ cursor: 'pointer', marginRight: '10px' }} />
                        <Typography variant="subtitle1">Download Reports</Typography>
                      </div>
                      <TablePagination
                        component="div"
                        count={filteredTasksByForm.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 15, 25, { label: 'All', value: -1 }]}
                        labelRowsPerPage="Rows per page:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : 'more than'}`}
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
                        style={{ marginRight: '10px' }}
                      />
                    </div>
                  </>
                </TableContainer>
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

        <Dialog open={openDownloadDialog} onClose={handleCloseDownloadDialog} PaperProps={{ className: classes.dialogCustom }}>
          <DialogTitle className={classes.dialogTitle}>Download Reports</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              style={{ marginTop: '25px' }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              style={{ marginTop: '25px' }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              className={`${classes.button} ${classes.downloadButton}`}
              onClick={downloadFilteredData}
              startIcon={<DateRangeIcon />}
              variant="outlined"
            >
              Download Date Range
            </Button>
            <Button
              className={`${classes.button} ${classes.clearDatesButton}`}
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              variant="outlined"
              startIcon={<ClearIcon />}
            >
              Clear Dates
            </Button>

            <Button
              variant="outlined"
              className={`${classes.button} ${classes.downloadButton}`}
              onClick={() => {
                setStartDate('');
                setEndDate('');
                downloadExcel(filteredTasksByForm, uniqueFormFields);
                handleCloseDownloadDialog();
              }}
              disabled={startDate !== ''}
              startIcon={<CloudDownloadIcon />}
            >
              Download All
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </div>
    </>
  );
};

export default Reports;
