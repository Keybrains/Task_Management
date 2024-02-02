import React from 'react';
import { useNavigate } from 'react-router-dom'; // Step 1: Import useNavigate
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
// components
import page404 from 'assets/images/404-drib23.gif';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function Page404() {
  const navigate = useNavigate(); // Step 2: Initialize useNavigate

  return (
    <Container>
      <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
        <Typography variant="h3" paragraph>
          Sorry, page not found!
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling.
        </Typography>

        <Box component="img" src={page404} sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }} />

        {/* Update the Button component to use navigate function */}
        <Button
          size="large"
          variant="contained"
          onClick={() => navigate('/userlogin')} // Step 3: Use navigate to go to home
        >
          Go to Home
        </Button>
      </ContentStyle>
    </Container>
  );
}
