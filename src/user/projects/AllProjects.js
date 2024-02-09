import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import axiosInstance from 'superadmin/config/AxiosInstanceSuperAdmin';
import { Flag, ShortText, Description, CalendarToday } from '@mui/icons-material';
import { Grid, Typography, Card, CardContent } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
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
const AllProjects = () => {
  const [loading, setLoading] = useState(true);

  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const loggedInUserId = parsedToken.userId?.user_id;

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get(`/addusers/getprojects/${loggedInUserId}`);
        setProjects(response.data.projects); // Update this line
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
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
    <>
      {loading && (
        <div style={fullScreenLoaderStyle}>
          <Loader />
        </div>
      )}
      <div style={loading ? { display: 'none' } : {}}>
        <Grid container spacing={3} style={{ paddingTop: '100px' }}>
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
            <Typography variant="h5" gutterBottom style={{ marginLeft: '10px' }}>
              All Projects
            </Typography>
            <Grid container spacing={2}>
              {projects.length > 0 ? (
                projects.map((project, index) => (
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
        </Grid>
      </div>
    </>
  );
};

export default AllProjects;
