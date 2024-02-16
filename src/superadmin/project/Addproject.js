import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  IconButton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import axiosInstance from '../config/AxiosInstanceSuperAdmin';

const Addproject = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('files', file);
    try {
      const uploadResponse = await axios.post('https://propertymanager.cloudpress.host/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imagePath = uploadResponse.data.files[0].url;
      const imageName = imagePath.split('/').pop();

      await axiosInstance.post('/adminprojects/project', {
        image: imageName,
        url
      });

      setUploadSuccess(true);
      setFileName('');
      setFile(null);
      setUrl('');
      fetchProjects();
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Error saving the data');
    }
  };
  const basePath = 'https://propertymanager.cloudpress.host/api/images/upload/images/';
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get('/adminprojects/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
    try {
      await axiosInstance.delete(`projects/project/${projectId}`);
      setProjects(projects.filter((project) => project.project_id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleClickOpen = (projectId) => {
    setOpenDialog(true);
    setSelectedProjectId(projectId);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    // Perform the delete operation
    await handleDelete(selectedProjectId);
    setOpenDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > :not(style)': { m: 1 },
          maxWidth: 500,
          margin: 'auto',
          padding: 1,
          backgroundColor: 'background.default',
          borderRadius: 2
        }}
      >
        <Paper elevation={3} sx={{ width: '100%', p: 3, borderRadius: 2, boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)' }}>
          <Typography
            variant="h5"
            gutterBottom
            component="div"
            sx={{ fontWeight: 'medium', color: 'primary.main' }}
            style={{ color: 'rgba(255, 200, 150)'}}
          >
            Upload Image and URL
          </Typography>
          <TextField label="URL" variant="filled" value={url} onChange={handleUrlChange} fullWidth margin="normal" />
          <Button variant="outlined" component="label" fullWidth sx={{ margin: '8px 0', borderColor: 'action.active' }}>
            Upload File
            <input type="file" hidden onChange={handleFileChange} />
            <PhotoCamera sx={{ ml: 1 }} />
          </Button>
          {fileName && (
            <Stack direction="row" spacing={1} justifyContent="center">
              <Chip label={fileName} onDelete={() => setFileName('')} color="primary" />
            </Stack>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button type="submit" variant="contained" style={{ backgroundColor: 'rgba(255, 200, 150)', color: 'black' }}>
              Submit
            </Button>
          </Box>
          {uploadSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Image and URL saved successfully!
            </Alert>
          )}
          {uploadError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {uploadError}
            </Alert>
          )}
        </Paper>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4, margin: 'auto' }}>
        <Table aria-label="projects table">
          <TableHead style={{ backgroundColor: 'rgba(255, 200, 150)' }}>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project) => (
              <TableRow key={project._id}>
                <TableCell component="th" scope="row">
                  <img src={`${basePath}${project.image}`} alt="Project" style={{ width: '100px', height: 'auto' }} />
                </TableCell>
                <TableCell>{project.url}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleClickOpen(project.project_id)} color="error">
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={projects.length}
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
            style: { marginBottom: '10px' },
            renderValue: (value) => `${value} rows`
          }}
          nextIconButtonProps={{
            style: {
              marginBottom: '5px'
            }
          }}
          backIconButtonProps={{
            style: {
              marginBottom: '5px'
            }
          }}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete this project?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Addproject;
