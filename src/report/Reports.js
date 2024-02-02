import React, { useState, useEffect } from 'react';
import axiosInstance from 'superadmin/config/AxiosInstanceSuperAdmin';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Button,
  Box
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
import * as XLSX from 'xlsx';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks with user details from the backend
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(`/addtasks/adminstasks/${loggedInUserId}`);
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Function to get unique form field keys
  const getUniqueFormFields = () => {
    const uniqueFormFields = new Set();
    tasks.forEach((task) => {
      Object.keys(task.formFields).forEach((key) => uniqueFormFields.add(key));
    });
    return Array.from(uniqueFormFields);
  };

  const uniqueFormFields = getUniqueFormFields();

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

  //searchbaar
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = tasks.filter(
    (task) =>
      task.userFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.userLastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadExcel = () => {
    const dataForExcel = filteredReports.map((task) => {
      const rowData = {
        'User Name': `${task.userFirstName} ${task.userLastName}`,
        ...task.formFields
      };
      return rowData;
    });

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, 'reports.xlsx');
  };

  return (
    <>
      {loading && (
        <div style={fullScreenLoaderStyle}>
          <Loader />
        </div>
      )}
      <div style={loading ? { display: 'none' } : {}}>
        <div>
          <h1>Reports</h1>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <TextField
              label="Search By Username"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ marginTop: '10px', marginBottom: '10px' }}
            />
            <Button
              variant="contained"
              style={{ backgroundColor: 'rgba(71, 121, 126, 1)', color: '#fff', marginRight: '10px' }}
              onClick={handleDownloadExcel}
            >
              Download Excel
            </Button>
          </Box>
          <TableContainer component={Paper}>
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
                {(rowsPerPage > 0 ? filteredReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : users).length > 0 ? (
                  (rowsPerPage > 0 ? filteredReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : users).map((task) => (
                    <TableRow key={task.taskId}>
                      <TableCell>
                        {task.userFirstName} {task.userLastName}
                      </TableCell>
                      {uniqueFormFields.map((field) => (
                        <TableCell key={field}>{task.formFields[field] || 'N/A'}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={uniqueFormFields.length + 1} style={{ textAlign: 'center' }}>
                      No forms available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

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
        </div>
      </div>
    </>
  );
};

export default Reports;
