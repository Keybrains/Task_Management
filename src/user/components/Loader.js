// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// loader style
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

// ==============================|| Loader ||============================== //

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress
      sx={{
        // Customize the color of the progress bar itself
        '& .MuiLinearProgress-bar': {
          backgroundColor: 'rgba(60,62,75)' // Custom color for the progress bar
        },
        // Customize the background color of the progress bar (the part that's not yet filled)
        backgroundColor: 'rgb(255,255,255)' // Example: a light gray background
      }}
    />
  </LoaderWrapper>
);

export default Loader;
