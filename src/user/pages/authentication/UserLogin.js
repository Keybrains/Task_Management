import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthLogin from './auth-forms/UserAuthLogin';
import AuthWrapper from './UserAuthWrapper';

// ================================|| LOGIN ||================================ //

const UserLogin = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="center" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3" style={{ color: '#3c3e4b' }}>
            User Login
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthLogin />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default UserLogin;
