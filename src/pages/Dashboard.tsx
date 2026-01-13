import { Backdrop, CircularProgress, Container, Fab, Toolbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NavBar from '../components/NavBar';
import TopicsList from '../components/TopicsList';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export interface DashboardProps {
  onLogout: () => void;
  username?: string;
}

export default function Dashboard(props: DashboardProps) {
  const { onLogout, username } = props;
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  return (
    <Container sx={{display:'flex', minHeight: '100vh'}}>
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
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Toolbar />
        <Typography variant="h5">Welcome to Qrator, {username}.</Typography>
        <Typography variant="body1">
          Start the discussion now.
        </Typography>
        <TopicsList onLoadingComplete={() => setIsLoading(false)}></TopicsList>
        {username == "admin" && ( //TOOD: Superficial, add verification on backend later
        <Fab color="secondary" aria-label="Add topic" size="large" onClick={() => navigate("/addtopic")}
          sx={
              {
              position: "fixed",
              bottom: 32,
              right: 32
          }}>
              <AddIcon></AddIcon>
          </Fab>
        )}
      </Container>
    </Container>
  );
};