import { Container, Fab, Toolbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NavBar from '../components/NavBar';
import TopicsList from '../components/TopicsList';
import { useNavigate } from 'react-router';

export interface DashboardProps {
  onLogout: () => void;
  username?: string;
}

export default function Dashboard(props: DashboardProps) {
  const { onLogout, username } = props;
  const navigate = useNavigate();
  
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
        <Typography variant="h5">Welcome to Qrator, {username}.</Typography>
        <Typography variant="body1">
          Start the discussion now.
        </Typography>
        <TopicsList></TopicsList>
        {username == "admin" && ( //TODO: Superficial, add verification on backend later
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