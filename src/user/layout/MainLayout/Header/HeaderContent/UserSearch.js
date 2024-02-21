import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../../../config/AxiosInstanceUser';
import { FormControl, Box } from '@mui/material';

const SearchbarStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: 0, // Set padding to 0
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
    padding: 0, // Ensure padding is 0 even on small devices
  },
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0, // Again, ensure no padding on extra small devices
  }
}));

const UserSearch = () => {
  const basePath = 'https://propertymanager.cloudpress.host/api/images/upload/images/';
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/adminprojects/projects');
        setProjects(response.data);
        console.log('response.data', response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <Box sx={{
          width: '100%',
          ml: { xs: 0, md: 1 },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          padding: 0, // Override to ensure no padding
          margin: 0, // Override to ensure no margin
        }}
      >
        <FormControl sx={{
            width: { xs: '100%', md: 224 },
            margin: 0, // Ensure no margin is applied
            padding: 0, // Ensure no padding is applied
          }}
        >
          <SearchbarStyle>
            {projects.map((project) => (
              <button
                key={project.id}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  margin: 0, // Ensure button has no margin
                }}
                onClick={() => window.open(project.url, '_blank')}
                onKeyPress={(event) => event.key === 'Enter' && window.open(project.url, '_blank')}
              >
                <img
                  src={`${basePath}${project.image}`}
                  alt={project.name}
                  style={{ width: '100px', height: '70px', objectFit: 'contain', margin: 0, padding: 0 }} // Ensure img has no margin or padding
                />
              </button>
            ))}
          </SearchbarStyle>
        </FormControl>
      </Box>
    </>
  );
};

export default UserSearch;
