import {
  Box,
  Grid,
  AppBar,
  Container,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import {
  NotificationsOutlined,
  Settings,
  Logout,
  AccountCircleOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NavBarComponent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);

  const handleAvatarClicked = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNotificationClicked = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const notificationHandleClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || user.email
    : "ADMIN DESTINY";
  
  const userInitial = user?.firstName?.[0] || user?.username?.[0] || user?.email?.[0] || "P";

  return (
    <Grid container>
      <Grid item md={12}>
        <Paper elevation={4}>
          <AppBar sx={{ padding: 2 }} position="static">
            <Container maxWidth="xxl">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component="a"
                  href="/home"
                  sx={{
                    mx: 2,
                    display: { xs: "none", md: "flex" },
                    fontWeight: 700,
                    letterSpacing: ".2rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Destiny Inventory Pro
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                  }}
                >
                  <IconButton color="inherit">
                    <Badge variant="dot" color="error" invisible={false}>
                      <NotificationsOutlined
                        sx={{ width: 32, height: 32 }}
                        onClick={handleNotificationClicked}
                      />
                    </Badge>
                  </IconButton>

                  <IconButton
                    onClick={handleAvatarClicked}
                    size="small"
                    sx={{ mx: 2 }}
                    aria-haspopup="true"
                  >
                    <Tooltip title="Account settings">
                      <Avatar
                        src={user?.image || undefined}
                        sx={{ width: 36, height: 36, bgcolor: "secondary.main" }}
                      >
                        {userInitial.toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  </IconButton>
                  <Typography fontFamily={"Inter"} fontWeight="600">
                    {displayName}
                  </Typography>
                </Box>

                <Menu
                  open={open}
                  anchorEl={anchorEl}
                  onClick={handleClose}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { minWidth: 200, mt: 1 },
                  }}
                >
                  {user && (
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2" fontWeight="700">
                        {displayName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email || user.username}
                      </Typography>
                    </Box>
                  )}
                  <Divider />

                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <AccountCircleOutlined fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>

                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                    <ListItemIcon>
                      <Logout fontSize="small" color="error" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Container>
          </AppBar>
        </Paper>
      </Grid>
    </Grid>
  );
}
