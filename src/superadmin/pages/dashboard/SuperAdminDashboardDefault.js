// React essentials
import { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';

// Components and icons
import AnalyticEcommerce from 'superadmin/components/cards/statistics/AnalyticEcommerce';
import axiosInstance from 'config/AxiosInstanceAdmin';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// ==============================|| DASHBOARD - DEFAULT ||============================== //
const SuperAdminDashboardDefault = () => {
  const [adminCount, setAdminCount] = useState('0');
  // Add more states as needed for different statistics

  useEffect(() => {
    // Fetch admin count
    axiosInstance
      .get('/addadmins/countadmins')
      .then((response) => {
        setAdminCount(response.data.count.toString());
      })
      .catch((error) => {
        console.error('There was an error fetching the admin count:', error);
      });

    // Implement additional data fetching here
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5" gutterBottom>
          Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Admin" count={adminCount} icon={AdminPanelSettingsIcon} color="#FF9800" />
      </Grid>
      {/* Add more Grid items for different statistics */}
    </Grid>
  );
};

export default SuperAdminDashboardDefault;
