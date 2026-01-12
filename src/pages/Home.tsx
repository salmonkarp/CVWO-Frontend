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
        Welcome to Qrator.
      </Typography>
      <Typography variant="body1">
        Start the discussion now.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/login')}>
        Login
      </Button>
    </Box>
  );
};

export default Home;
