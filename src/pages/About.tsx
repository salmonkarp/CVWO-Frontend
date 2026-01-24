import { Container, Toolbar, Typography, Link } from '@mui/material';
import NavBar from '../components/NavBar';
import type { DashboardProps } from './Dashboard';

export default function Dashboard(props: DashboardProps) {
  const { onLogout } = props;
  
  return (
    <Container sx={{display:'flex', minHeight: '100vh'}}>
      <NavBar onLogout={onLogout} window={window} />
      <Container
        sx={{
          p: {
              md: 4,
              xs: 2
          },
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: 2
        }}
      >
        <Toolbar />
        <Typography variant="h5" fontWeight={700}>Qrator - Start the discussion now.</Typography>
        <Typography variant="body1">
          Qrator is an online discussion platform for everyone.
        </Typography>
        <Typography variant="body1">
            Create topics, engage in discussions, and connect with others. Join our community today and start exploring!
        </Typography>
        <Typography>
            Go to the github repository <Link href="https://github.com/salmonkarp/CVWO-Frontend">here.</Link>
        </Typography>
      </Container>
    </Container>
  );
};