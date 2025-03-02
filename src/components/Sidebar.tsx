import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <List>
        <ListItemButton onClick={() => navigate("/dashboard")}>
          <ListItemIcon><Dashboard /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/")}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
