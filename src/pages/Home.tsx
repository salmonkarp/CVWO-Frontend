import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        gap: 2
      }}
    >
      <Typography variant="h3" component="h1">
        Welcome to My App
      </Typography>
      <Typography variant="body1">
        This is the home page. Please log in to access the dashboard.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/login')}>
        Go to Login
      </Button>
    </Box>
  );
};

export default Home;
