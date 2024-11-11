import React, { useState } from 'react';
import { 
Box,
Divider,
List,
ListItem,
ListItemButton,
ListItemText,
Typography,
Button,
IconButton,
Menu,
MenuItem,
Drawer,
ListItemIcon
} from '@mui/material';
import _ from 'lodash';

import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';

// const navItems = ['Home', 'Shop', 'Products', 'Wishlist'];

function SecondaryAppBar(props) {
    const { 
        anchor, 
        navItems = [], 
        iconItems = [], 
        rightNavItems = [], 
        settings = [], 
        user,
        handleOpenAuthDialog 
    } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
            >
            <List>
                {navItems.map(({ title, icon, path }, index) => (
                    <ListItem key={title} disablePadding>
                        <ListItemButton onClick={() => navigate(path)}>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {rightNavItems.map(({ title, icon, path }, index) => (
                    <ListItem key={title} disablePadding>
                        <ListItemButton onClick={() => navigate(path)}>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {iconItems.map(({ title, icon, path }, index) => (
                    <ListItem key={title} disablePadding>
                        <ListItemButton onClick={() => navigate(path)}>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {!_.isEmpty(user) && settings.map(({ title, icon, path }, index) => (
                    <ListItem key={title} disablePadding>
                        <ListItemButton onClick={() => navigate(path)}>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {!user ? <ListItem key={'Login'} disablePadding>
                    <ListItemButton onClick={() => {
                        handleOpenAuthDialog()
                    }}>
                        <ListItemIcon>
                            <LoginIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Login'} />
                    </ListItemButton>
                </ListItem> : '' }
            </List>
        </Box>
    );

    return (
        <div className='seconday-appbar container'>
            <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                {props.navItems.map((item) => (
                    <Button 
                        key={item.title} 
                        sx={{ color: '#fff', textTransform: 'none' }} 
                        onClick={(e) => {
                            if (item.isDropdown) item.handleClick(e)
                            else navigate(item.path)
                        }}
                        endIcon={item.isDropdown && <KeyboardArrowDownIcon />}
                        >
                        {item.title}
                    </Button>
                ))}
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                {rightNavItems.map((item) => (
                    <Button key={item.title} sx={{ color: '#fff', textTransform: 'none' }} onClick={() => navigate(item.path)}>
                        {item.title}
                    </Button>
                ))}
            </Box>
            {/* <Box sx={{ display: { xs: 'none', sm: 'none' } }}>
                {iconItems.map((item) => (
                    <IconButton onClick={() => navigate(item.path)}>
                        {item.icon}
                    </IconButton>
                ))}
            </Box> */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "flex", md: "none" } }}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={toggleDrawer(anchor, true)}
                    color="inherit"
                    >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    anchor={anchor}
                    open={state[anchor]}
                    className="drawer-wrapper"
                    onClose={toggleDrawer(anchor, false)}
                >
                    {list(anchor)}
                </Drawer>
            </Box>
        </div>
    )
}

export default SecondaryAppBar;