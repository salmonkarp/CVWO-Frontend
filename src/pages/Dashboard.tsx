import { Box, Typography } from '@mui/material';
import NavBar from '../components/NavBar';

const Dashboard = () => {

  return (
    <Box>
      
      <NavBar />
      
      <Box
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Typography variant="h4">Welcome to your Qrator dashboard!</Typography>
        <Typography variant="body1">
          Here you can access your app features.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;