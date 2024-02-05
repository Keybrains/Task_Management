import React, { useEffect, useState } from 'react';
import axiosInstance from 'user/config/AxiosInstanceUser';
import {
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
  TablePagination
} from '@mui/material';
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

const Reports = () => {
  //get logged user data
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  // const loggedInAdminId = parsedToken.userId?.admin_id;
  const loggedInUserId = parsedToken.userId?.user_id;

  //lodder
  const [loading, setLoading] = useState(true);
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
  }, []);

  const [forms, setForms] = useState([]);

  const fetchForms = async (projectId) => {
    try {
      const response = await axiosInstance.get(`/addreportingfrom/getprojectforms/${projectId}`);
      setForms(response.data.forms || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  //for from all fields

  //fetch task

  const [tasks, setTasks] = useState([]);
  const [selectedTaskProject, setSelectedTaskProject] = useState(null);
  const [selectedTaskForm, setSelectedTaskForm] = useState(null);

  const fetchTasks = async (projectId, formId) => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(`/addtasks/adminstasks/${loggedInUserId}?projectId=${projectId}&formId=${formId}`);

      if (response.data && response.data.length > 0) {
        const filteredTasks = response.data.filter((task) => task.projectId === projectId || task.formId === formId);
        setTasks(filteredTasks);
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
    if (selectedTaskProject && selectedTaskForm) {
      fetchTasks(selectedTaskProject, selectedTaskForm);
    }
  }, [selectedTaskProject, selectedTaskForm]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const getUniqueFormFields = () => {
    const uniqueFormFields = new Set();
    tasks.forEach((task) => {
      Object.keys(task.formFields).forEach((key) => uniqueFormFields.add(key));
    });
    return Array.from(uniqueFormFields);
  };

  const uniqueFormFields = getUniqueFormFields();
  //searchbaar
  const [searchQuery, setSearchQuery] = useState('');

  const filterTasks = () => {
    return tasks.filter((task) => {
      const fullName = `${task.userFirstName} ${task.userLastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  };

  const filteredTasks = filterTasks();

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
                All Report
              </Typography>
              <TextField
                select
                style={{ minWidth: '200px', marginRight: '10px' }}
                label="Select Project"
                variant="outlined"
                name="projectId"
                value={selectedTaskProject || ''}
                onChange={(event) => {
                  const projectId = event.target.value;
                  setSelectedTaskProject(projectId);
                  setSelectedTaskForm(null);
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

              <TextField
                select
                style={{ minWidth: '200px' }}
                label="Select Form"
                variant="outlined"
                name="formId"
                value={selectedTaskForm || ''}
                onChange={(event) => {
                  const formId = event.target.value;
                  setSelectedTaskForm(formId);
                }}
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
            </Box>
          </Grid>
          <Grid item xs={12}>
            {selectedTaskProject && selectedTaskForm ? (
              tasks.length > 0 ? (
                <TableContainer component={Paper}>
                  <>
                    <TextField
                      label="Search"
                      variant="outlined"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      sx={{ marginBottom: '10px', marginTop: '10px' }}
                    />

                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }}>User Name</TableCell>
                          {uniqueFormFields.map((field) => (
                            <TableCell style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: 'white' }} key={field}>
                              {field}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTasks.map((task) => (
                          <TableRow key={task._id}>
                            <TableCell>
                              {task.userFirstName} {task.userLastName}
                            </TableCell>
                            {uniqueFormFields.map((field) => (
                              <TableCell key={field}>
                                {Array.isArray(task.formFields[field])
                                  ? task.formFields[field].join(', ')
                                  : task.formFields[field] || 'N/A'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      count={tasks.length}
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
      </div>
    </>
  );
};

export default Reports;
