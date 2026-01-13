import { Box, Container, Toolbar, Typography } from '@mui/material';
import NavBar from '../components/NavBar';
import TopicsList from '../components/TopicsList';

interface DashboardProps {
  onLogout: () => void;
  username?: string;
}

export default function Dashboard(props: DashboardProps) {
  const { onLogout, username } = props;
  
  return (
    <Box sx={{display:'flex', minHeight: '100vh'}}>
      <NavBar onLogout={onLogout} window={window} />
      <Container
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: 2
        }}
      >
        <Toolbar />
        <Typography variant="h4">Welcome to Qrator, {username}.</Typography>
        <Typography variant="body1">
          Start the discussion now.
        </Typography>
        <TopicsList></TopicsList>
        
      </Container>
    </Box>
  );
};