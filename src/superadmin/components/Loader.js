import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// Loader wrapper style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2)
  }
}));

// Loader Component
const Loader = () => (
  <LoaderWrapper>
    <LinearProgress
      sx={{
        // Customize the color of the progress bar itself
        '& .MuiLinearProgress-bar': {
          backgroundColor: 'rgba(255, 165, 0)' // Custom color for the progress bar
        },
        // Customize the background color of the progress bar (the part that's not yet filled)
        backgroundColor: 'rgba(0, 0, 0, 0.1)' // Example: a light gray background
      }}
    />
  </LoaderWrapper>
);

export default Loader;
