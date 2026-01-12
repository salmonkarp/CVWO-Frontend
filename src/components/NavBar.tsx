import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBar = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Dashboard
                </Typography>
                <Button color="inherit" variant="outlined" onClick={handleLogout}>
                Logout
                </Button>
            </Toolbar>
        </AppBar>
    );

}

export default NavBar;