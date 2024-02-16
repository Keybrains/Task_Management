import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../../../config/AxiosInstanceAdmin';
import { FormControl, Box } from '@mui/material';
// ==============================|| HEADER CONTENT - SEARCH ||============================== //
const SearchbarStyle = styled('div')(({ theme }) => ({
  display: 'contents', // Changed to 'flex' from 'contents' for proper flexbox behavior
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
    padding: theme.spacing(1)
  },
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

const Search = () => {
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
      <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
        <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
          <SearchbarStyle>
            {projects.map((project) => (
              <button
                key={project.id}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex' }}
                onClick={() => window.open(project.url, '_blank')}
                onKeyPress={(event) => event.key === 'Enter' && window.open(project.url, '_blank')}
              >
                <img
                  src={`${basePath}${project.image}`}
                  alt={project.name}
                  style={{ width: '100px', height: '70px', objectFit: 'contain' }}
                />
              </button>
            ))}
          </SearchbarStyle>
        </FormControl>
      </Box>
    </>
  );
};

export default Search;
