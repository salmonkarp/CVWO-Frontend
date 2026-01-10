import { Box, Typography, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // remove JWT
    navigate('/login');
  };

  return (
    <Box>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Typography variant="h4">Welcome to your dashboard!</Typography>
        <Typography variant="body1">
          Here you can access your app features.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;