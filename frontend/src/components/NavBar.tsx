import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useAuth } from "../context/Auth/AuthContext";

import Grid from "@mui/material/Grid";
import { Badge, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {  ShoppingCart } from "@mui/icons-material";

function NavBar() {
  const { username, isAuthenticated, logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
const navigate = useNavigate();
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handelLogin = ()=>{
    
    navigate('/login');
  }

  const handelLogout = ()=>{
    logout();
    navigate('/');
    handleCloseUserMenu();
  }

  const handleCart =()=>{
    navigate('/cart')
  }
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AdbIcon sx={{ display: "flex", mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                Tech Hub
              </Typography>
            </Box>

            <Box sx={{ display:"flex", flexDirection:"row", alignItems:"center" ,flexGrow: 0 }} gap={4}>
              <IconButton aria-label="cart" onClick={handleCart}>
                <Badge badgeContent={4} color="secondary">
                  <ShoppingCart sx={{color: "#ffffff"}} />
                </Badge>
              </IconButton>
              {isAuthenticated ? <>
                            <Tooltip title="Open settings">
                <Grid container alignItems="center" spacing={2}>
                  <Typography>{username}</Typography>

                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={username || ""}
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Grid>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    My Orders
                  </Typography>
                </MenuItem>

                <MenuItem onClick={handelLogout}>
                  <Typography sx={{ textAlign: "center" }}>LogOut</Typography>
                </MenuItem>
              </Menu>
              </> 
            :   
           <Button variant="contained" color="info" onClick={handelLogin}>Login</Button> }

            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
