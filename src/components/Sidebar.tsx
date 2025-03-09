// 

// import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
// import { Dashboard, ExitToApp, LocalShipping } from "@mui/icons-material"; // Icône pour les livraisons
// import { useNavigate } from "react-router-dom";

// export default function Sidebar() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   return (
//     <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
//       <List>
//         <ListItemButton onClick={() => navigate("/dashboard")}>
//           <ListItemIcon><Dashboard /></ListItemIcon>
//           <ListItemText primary="Dashboard" />
//         </ListItemButton>
//         <ListItemButton onClick={() => navigate("/deliveries")}>
//           <ListItemIcon><LocalShipping /></ListItemIcon> {/* Icône pour les livraisons */}
//           <ListItemText primary="Deliveries" />
//         </ListItemButton>
//         <ListItemButton onClick={handleLogout}>
//           <ListItemIcon><ExitToApp /></ListItemIcon>
//           <ListItemText primary="Déconnexion" />
//         </ListItemButton>
//       </List>
//     </Drawer>
//   );
// }

import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, ExitToApp, LocalShipping, Storage } from "@mui/icons-material"; // Icône pour les livraisons et les usages
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // const handleLogout = () => {
  //   logout(); // Appeler la méthode de déconnexion
  //   navigate("/login");
  // };

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <List>
        <ListItemButton onClick={() => navigate("/dashboard")}>
          <ListItemIcon><Dashboard /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/deliveries")}>
          <ListItemIcon><LocalShipping /></ListItemIcon> {/* Icône pour les livraisons */}
          <ListItemText primary="Deliveries" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/usages")}>
          <ListItemIcon><Storage /></ListItemIcon> {/* Icône pour les usages */}
          <ListItemText primary="Usages" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}