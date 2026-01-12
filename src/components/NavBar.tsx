import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import React from "react";

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

    const handleDrawerToggle = () => {
        setIsMobileDrawerOpen((prevState) => !prevState);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', backgroundColor: 'primary.main', color: 'primary.contrastText', height: '100%' }}>
            <Typography variant="h6" sx={{ my: 2 }} fontWeight={"700"}>
                Menu
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                <ListItem key={item} disablePadding>
                    <ListItemButton sx={{ textAlign: 'center' }} href={`/${item.toLowerCase()}`}>
                    <ListItemText primary={item} />
                    </ListItemButton>
                </ListItem>
                ))}
                <ListItem key="Logout" disablePadding>
                    <ListItemButton sx={{ textAlign: 'center' }} onClick={handleLogout}>
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
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                >
                    Qrator Desktop
                </Typography>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {navItems.map((item) => (
                    <Button key={item} href={`/${item.toLowerCase()}`} color="inherit">
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