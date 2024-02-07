import { Box } from '@mui/material';

// Import the image
import backgroundImage from 'assets/images/imgpsh_fullsize_anim-1.jpg'; // Update the path accordingly

// ==============================|| AUTH BLUR BACK IMG ||============================== //

const AuthBackground = () => {
  // const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: -1,
        width: '100%', // Set your desired width
        height: '100vh' // Set your desired height
      }}
    >
      <img src={backgroundImage} alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </Box>
  );
};

export default AuthBackground;
