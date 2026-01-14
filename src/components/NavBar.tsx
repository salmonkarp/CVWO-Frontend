import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import React from "react";
import { useNavigate } from "react-router";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';

interface NavBarProps {
    onLogout: () => void;
    window?: Window;
}

const navItems = ['Dashboard', 'Account', 'About'];
const drawerWidth = 240;

export default function NavBar(props: NavBarProps) {
    const { onLogout, window } = props;
    const container = window !== undefined ? () => window.document.body : undefined;
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setIsMobileDrawerOpen((prevState) => !prevState);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ height: '100%' }}>
            <Divider />
            <List 
            component="nav"
            sx={{
                bgcolor: 'background.paper'
            }}
            subheader={
                <ListSubheader component="div">
                Menu
                </ListSubheader>
            }>
                <ListItem key={'dashboard'} disablePadding>
                    <ListItemButton sx={{ textAlign: 'start' }} onClick={() => navigate(`/dashboard`)}>
                    <ListItemIcon>
                        <HomeIcon></HomeIcon>
                    </ListItemIcon>
                    <ListItemText primary={'Dashboard'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'account'} disablePadding>
                    <ListItemButton sx={{ textAlign: 'start' }} onClick={() => navigate(`/account`)}>
                    <ListItemIcon>
                        <ManageAccountsIcon></ManageAccountsIcon>
                    </ListItemIcon>
                    <ListItemText primary={'Account'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'about'} disablePadding>
                    <ListItemButton sx={{ textAlign: 'start' }} onClick={() => navigate(`/about`)}>
                    <ListItemIcon>
                        <InfoIcon></InfoIcon>
                    </ListItemIcon>
                    <ListItemText primary={'About'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key="Logout" disablePadding>
                    <ListItemButton sx={{ textAlign: 'start' }} onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon></LogoutIcon>
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    

    return (
        <>
            <AppBar component="nav">
                <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>       
                <img src="/chat.png" alt="Qrator Logo" style={{ height: 30, marginRight: 8 }} />
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    // fontWeight={700}
                >
                    Qrator Desktop
                </Typography>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'block', sm: 'none' } }}
                >
                    Qrator Mobile
                </Typography>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {navItems.map((item) => (
                    <Button key={item} onClick={() => navigate(`/${item.toLowerCase()}`)} color="inherit">
                        {item}
                    </Button>
                    ))}
                    <Button key="Logout" color="inherit" onClick={handleLogout}>Logout</Button>
                </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                container={container}
                variant="temporary"
                open={isMobileDrawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    color: 'primary.main'
                }}
                >
                {drawer}
                </Drawer>
            </nav>
        </>
    );

}