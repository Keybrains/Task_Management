import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from 'config/AxiosInstanceAdmin';
// material-ui
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Divider
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import

import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useNavigate } from '../../../../node_modules/react-router-dom/dist/index';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
  const [checked, setChecked] = React.useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Failed to decode token');
    }
  };

  const handleTokenDecoding = (token) => {
    localStorage.setItem('authToken', token);
    try {
      const decodedToken = decodeToken(token);
      toast.success('Token Decoded Successfully');

      // Convert decodedToken to a string before storing it
      const decodedTokenString = JSON.stringify(decodedToken);
      localStorage.setItem('decodedToken', decodedTokenString);
    } catch (error) {
      console.error('Token decoding error:', error);
      toast.error('Failed to decode token');
    }
  };
  const handleNavigation = () => {
    navigate('/admin/register');
  };
  return (
    <>
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
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const response = await axiosInstance.post('/addadmins/adminlogin', values, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            const token = response.data.token;
            const decoded = jwtDecode(token);
            if (decoded.userId.status !== 'pending' && decoded.userId.status !== 'deactivate') {
              localStorage.setItem('authToken', token);
              handleTokenDecoding(token);
              navigate('/admin/dashboard/default');
              setStatus({ success: true });
            } else {
              setStatus({ success: false });
              setErrors({ submit: 'Your account is not active. Please contact the administrator.' });
            }
            setSubmitting(false);
          } catch (err) {
            console.error('Login failed:', err);
            setStatus({ success: false });
            setErrors({ submit: 'Login failed. Please check your credentials.' });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me sign in</Typography>}
                  />
                  <Link variant="h6" component={RouterLink} to="" color="text.primary">
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: '#47797e', marginBottom: '20px' }}
                  >
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider>
                <Typography
                  component={Link}
                  // to="#"
                  onClick={handleNavigation}
                  variant="body1"
                  sx={{ textDecoration: 'none', cursor: 'pointer', color: 'primary' }}
                >
                  Dont have an account?
                </Typography>
              </Divider>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
