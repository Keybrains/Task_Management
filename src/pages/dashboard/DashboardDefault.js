import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import axiosInstance from 'config/AxiosInstanceAdmin';
import FolderIcon from '@mui/icons-material/Folder';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const DashboardDefault = () => {
  const decodedToken = localStorage.getItem('decodedToken');
  const parsedToken = JSON.parse(decodedToken);
  const adminId = parsedToken.userId?.user_id;

  const [counts, setCounts] = useState({
    projects: 0,
    reportingForms: 0,
    users: 0,
    tasks: 0
  });

  useEffect(() => {
    if (adminId) {
      const requestUrl = `/counts/allcounts/${adminId}`;
      axiosInstance
        .get(requestUrl)
        .then((response) => {
          const data = response.data;
          if (data.success && data.counts) {
            setCounts(data.counts);
          }
        })
        .catch((error) => console.error('Error fetching counts:', error));
    }
  }, [adminId]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Project" count={String(counts.projects)} icon={FolderIcon} color="#47797e" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Forms" count={String(counts.reportingForms)} icon={AssessmentIcon} color="#47797e" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Users" count={String(counts.users)} icon={PeopleIcon} color="#47797e" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Report" count={String(counts.tasks)} icon={TaskAltIcon} color="#47797e" />
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
