import { AppBar, Button, Toolbar, Typography } from "@mui/material";

const NavBar: React.FC<{ onLogout: () => void, username?: string }> = ({ onLogout, username }) => {

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Dashboard
                </Typography>
                <Typography variant="h6" sx={{ mr: 2 }}>
                {username}
                </Typography>
                <Button color="inherit" variant="outlined" onClick={handleLogout}>
                Logout
                </Button>
            </Toolbar>
        </AppBar>
    );

}

export default NavBar;