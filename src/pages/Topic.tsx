import { Box, Container, IconButton, Toolbar, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from "react-router";
import { ArrowBack } from "@mui/icons-material";

export default function Topic(props: {username: string; onLogout: () => void}) {
    const { username, onLogout } = props;
    const { topic } = useParams<{topic: string}>();
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
                <Toolbar />
                <Box sx={{ height: 20, mb: 2, ml: -1 }}>
                    <IconButton onClick={() => navigate('/dashboard')}>
                    <ArrowBack />
                    </IconButton>
                </Box>
                <Typography variant="h5">t/{topic}</Typography>
            </Container>
        </Container>
    );
}