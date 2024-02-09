// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import FirebaseRegister from './auth-forms/AuthRegister';
import AuthWrapper from './AuthWrapper';

// ================================|| REGISTER ||================================ //

const Register = () => (
  <AuthWrapper>
    <Grid spacing={1}>
      <Grid item xs={12}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="baseline"
          sx={{ mb: { xs: -0.5, sm: 0.5 } }}
          style={{ color: '#47797e', marginBottom: '20px' }}
        >
          <Typography variant="h3">Admin Sign up</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <FirebaseRegister />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Register;
