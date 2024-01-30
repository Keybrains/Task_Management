import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthLogin from './auth-forms/SuperAdminAuthLogin';
import AuthWrapper from './SuperAdminAuthWrapper';

// ================================|| LOGIN ||================================ //

const Login = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="center" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3" style={{ color: '#ff7920' }}>
            Super Admin Login
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthLogin />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Login;
