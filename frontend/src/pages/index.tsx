import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon, Mail as MailIcon } from "@mui/icons-material";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import StyleIcon from "@mui/icons-material/Style";
import Head from "next/head";
import { useRouter } from "next/router";
import AuthLayout from "@/components/layout/AuthLayout";

const drawerWidth = 250;

const menuItems = [
  { text: "대시보드", link: "/", icon: <SportsMartialArtsIcon /> },
  { text: "대회 목록", link: "/category", icon: <MenuBookIcon /> },
  { text: "팔로잉 목록", link: "/following", icon: <MailIcon /> },
  { text: "내 프로필", link: "/mypage", icon: <StyleIcon /> },
  { text: "로그아웃", link: "/logout", icon: <StyleIcon /> },
];

//@ts-ignore
function ResponsiveDrawer({ window }) {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const DrawerContent = () => (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item.link} disablePadding>
            <ListItemButton
              onClick={() => {
                router.push(item.link);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Head>
        <title>자기개발 루틴 메이커</title>
        <meta name="description" content="Routine Maker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "none",
            color: "black",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              루틴 메이커
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
            position: "absolute",
          }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <DrawerContent />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            <DrawerContent />
          </Drawer>
        </Box>
        <MainContent />
      </Box>
    </>
  );
}

function MainContent() {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
    >
      <Toolbar />

      <Box>
        <Grid container>
          <Grid item xs={6} sx={{ p: 3 }}>
            <Box sx={{ background: "#fff", p: 3 }}>card1</Box>
          </Grid>
          <Grid item xs={6} sx={{ p: 3 }}>
            <Box sx={{ background: "#fff", p: 3 }}>card2</Box>
          </Grid>
        </Grid>
      </Box>

      <Typography>2024</Typography>

      <Typography>01/23 00:00</Typography>
      <Typography>3분 수행</Typography>
      <Typography>턱걸이 10개 푸쉬업 80개</Typography>

      <Typography>01/23 00:00</Typography>
      <Typography>3분 수행</Typography>
      <Typography>턱걸이 10개 푸쉬업 80개</Typography>

      <Typography>01/23 00:00</Typography>
      <Typography>3분 수행</Typography>
      <Typography>턱걸이 10개 푸쉬업 80개</Typography>

      <Typography>2023</Typography>
      <Typography>Consequat mauris...</Typography>
      <Typography>Load more</Typography>
    </Box>
  );
}

export default ResponsiveDrawer;
