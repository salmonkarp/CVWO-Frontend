import { Box, Typography } from '@mui/material';
import NavBar from '../components/NavBar';

interface DashboardProps {
  onLogout: () => void;
  username?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, username }) => {

  return (
    <Box>
      
      <NavBar onLogout={onLogout} username={username} />
      
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