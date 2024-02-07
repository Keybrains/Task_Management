import PropTypes from 'prop-types';
import { animated, useSpring } from 'react-spring';
import { Box, CardActionArea, Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

// Animated Typography for the count
const AnimatedTypography = animated(Typography);

const AnalyticEcommerce = ({ color = '#FF9800', title, count, icon: Icon }) => {
  // Spring animation for the count
  const props = useSpring({
    from: { number: 0 },
    to: { number: parseInt(count, 10) || 0 }
  });

  return (
    <MainCard
      content={false}
      sx={{
        p: 3, // Increased padding for a larger appearance
        py: 4, // Adjust top and bottom padding separately for vertical space
        backgroundColor: 'rgba(255, 152, 0, 0.12)', // Soft orange background for contrast
        '&:hover': {
          backgroundColor: 'rgba(255, 152, 0, 0.18)' // Slightly darken on hover for interactive feedback
        },
        transition: 'background-color 0.3s',
        borderLeft: `10px solid ${color}`, // Vibrant orange border for emphasis
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' // Soft shadow for depth
      }}
    >
      <CardActionArea>
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
            {Icon && <Icon style={{ fontSize: '2.25rem', color }} />}
            <Typography variant="h5" fontWeight="bold" color="textSecondary">
              {title}
            </Typography>
          </Box>
          <Grid container justifyContent="center">
            <AnimatedTypography variant="h2" component="div" color="textPrimary" style={{ fontWeight: 'bold', paddingLeft: '50px' }}>
              {props.number.to((n) => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
            </AnimatedTypography>
          </Grid>
        </Stack>
      </CardActionArea>
    </MainCard>
  );
};

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.elementType
};

export default AnalyticEcommerce;
