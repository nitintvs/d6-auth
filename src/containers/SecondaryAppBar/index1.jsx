import _ from "lodash";
import React, { useState } from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Drawer,
  ListItemIcon,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";

function SecondaryAppBar1(props) {
  const {
    colors,
    anchor,
    navItems = [],
    iconItems = [],
    rightNavItems = [],
    settings = [],
    user,
    handleOpenAuthDialog,
  } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isScreenWidthLessThan1200 = useMediaQuery("(max-width:1200px)");

  const toggleDrawer = (open) => () => {
    setMobileOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List
        sx={{
          paddingTop: 2,
          paddingBottom: 0,
        }}
      >
        {navItems.map(({ title, icon, path }, index) => (
          <ListItem key={title} disablePadding>
            <ListItemButton onClick={() => navigate(path)}>
              <ListItemIcon
                sx={{
                  color: `${colors.header_text} !important`,
                  "& svg": {
                    color: `${colors.header_text} !important`,
                  },
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={title}
                sx={{
                  "& .MuiTypography-root": {
                    color: `${colors.header_text} !important`,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List
        sx={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        {rightNavItems.map(({ title, icon, path }, index) => (
          <ListItem key={title} disablePadding>
            <ListItemButton onClick={() => navigate(path)}>
              <ListItemIcon
                sx={{
                  color: `${colors.header_text} !important`,
                  "& svg": {
                    color: `${colors.header_text} !important`,
                  },
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={title}
                sx={{
                  "& .MuiTypography-root": {
                    color: `${colors.header_text} !important`,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List
        sx={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        {iconItems.map(({ title, icon, path }, index) => (
          <ListItem key={title} disablePadding>
            <ListItemButton onClick={() => navigate(path)}>
              <ListItemIcon
                sx={{
                  color: `${colors.header_text} !important`,
                  "& svg": {
                    color: `${colors.header_text} !important`,
                  },
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={title}
                sx={{
                  "& .MuiTypography-root": {
                    color: `${colors.header_text} !important`,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List
        sx={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        {!_.isEmpty(user) &&
          settings.map(({ title, icon, path }, index) => (
            <ListItem key={title} disablePadding>
              <ListItemButton onClick={() => navigate(path)}>
                <ListItemIcon
                  sx={{
                    color: `${colors.header_text} !important`,
                    "& svg": {
                      color: `${colors.header_text} !important`,
                    },
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={title}
                  sx={{
                    "& .MuiTypography-root": {
                      color: `${colors.header_text} !important`,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <Divider />
      <List
        sx={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        {!user ? (
          <ListItem key={"Login"} disablePadding>
            <ListItemButton
              onClick={() => {
                handleOpenAuthDialog();
              }}
            >
              <ListItemIcon
                sx={{
                  color: `${colors.header_text} !important`,
                  "& svg": {
                    color: `${colors.header_text} !important`,
                  },
                }}
              >
                <LoginIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Login"}
                sx={{
                  "& .MuiTypography-root": {
                    color: `${colors.header_text} !important`,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ) : (
          ""
        )}
      </List>
    </Box>
  );

  return (
    <>
      {isScreenWidthLessThan1200 && (
        <>
          {isScreenWidthLessThan1200 && (
            <>
              <IconButton
                size="large"
                aria-label="open drawer"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon style={{ color: colors.header_text }} />
              </IconButton>
              <Drawer
                anchor={anchor}
                open={mobileOpen}
                onClose={toggleDrawer(false)}
                sx={{
                  ".MuiDrawer-paper": {
                    backgroundColor: `${colors.header_bg} !important`,
                  },
                  "& .MuiPaper-root": {
                    height: "100vh", // or any value you prefer
                    overflow: "visible",
                  },
                }}
              >
                {list()}
              </Drawer>
            </>
          )}
        </>
      )}
    </>
  );
}

export default SecondaryAppBar1;
