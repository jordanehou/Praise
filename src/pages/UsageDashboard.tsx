import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Edit, Delete, AddBox, ArrowBack } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";

// Définition des types
interface UsageType {
  id: number;
  product_id: number;
  user_id: number;
  usage_date: string;
  purpose: string;
  quantity_used: number;
}

interface ProductType {
  id: number;
  name: string;
}

interface UserType {
  id: number;
  username: string;
}

export default function UsageDashboard() {
  const navigate = useNavigate();
  const [usages, setUsages] = useState<UsageType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState<UsageType | null>(null);
  const [newUsage, setNewUsage] = useState({ product_id: 0, user_id: 0, usage_date: "", purpose: "", quantity_used: 0 });

  // Récupérer les données au chargement du composant
  useEffect(() => {
    fetchUsages();
    fetchProducts();
    fetchUsers(); // Récupérer les utilisateurs
  }, []);

  // Fonction pour récupérer les usages
  const fetchUsages = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/usages/list");
      setUsages(response.data.usages || []);
    } catch (error) {
      console.error("Erreur lors du chargement des usages", error);
    }
  };

  // Fonction pour récupérer les produits
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/products/list");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Erreur lors du chargement des produits", error);
    }
  };

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/users/list");
      setUsers(response.data.users || []);
      console.log(response.data.users); // Debug: Vérifiez les utilisateurs récupérés
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs", error);
    }
  };

  // Ouvrir le dialogue de création/modification
  const handleOpen = (usage: UsageType | null = null) => {
    setEditMode(!!usage);
    setSelectedUsage(usage);
    setNewUsage(usage ? { ...usage } : { product_id: 0, user_id: 0, usage_date: "", purpose: "", quantity_used: 0 });
    setOpen(true);
  };

  // Fermer le dialogue
  const handleClose = () => {
    setOpen(false);
    setSelectedUsage(null);
  };

  // Sauvegarder l'usage
  const handleSave = async () => {
    if (!newUsage.product_id || !newUsage.user_id || !newUsage.usage_date || !newUsage.purpose || !newUsage.quantity_used) {
      console.error("Tous les champs doivent être remplis.");
      return;
    }

    try {
      if (editMode && selectedUsage) {
        await axios.put(`http://127.0.0.1:8000/usages/update/${selectedUsage.id}`, newUsage);
      } else {
        await axios.post("http://127.0.0.1:8000/usages/create", newUsage);
      }
      await fetchUsages();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de l'usage", error);
    }
  };

  // Supprimer un usage
  const handleDelete = async () => {
    try {
      if (selectedUsage) {
        await axios.delete(`http://127.0.0.1:8000/usages/delete/${selectedUsage.id}`);
        fetchUsages();
        setConfirmDeleteDialog(false);
        setSelectedUsage(null);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'usage", error);
    }
  };

  // Confirmer la suppression
  const confirmDelete = (usage: UsageType) => {
    setSelectedUsage(usage);
    setConfirmDeleteDialog(true);
  };

  // Fermer le dialogue de confirmation
  const handleCloseConfirmDelete = () => {
    setConfirmDeleteDialog(false);
    setSelectedUsage(null);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "#f4f6f8" }}>
      <Sidebar />
      <Container sx={{ flexGrow: 1, padding: 4, maxWidth: "90%", marginRight: "5%", bgcolor: "#f4f6f8" }}>
        <Button
          sx={{
            mb: 2,
            borderRadius: 2,
            fontWeight: "bold",
            color: "#1565C0",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            boxShadow: "none",
            ":hover": { background: "rgba(21, 101, 192, 0.1)" },
          }}
          onClick={() => navigate("/dashboard")}
        >
          <ArrowBack sx={{ mr: 1 }} />
          Retour aux Catégories
        </Button>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1565C0" }}>
          📊 Usages
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddBox />}
          sx={{
            bgcolor: "#1565C0",
            ":hover": { bgcolor: "#0d47a1" },
            mb: 2,
            borderRadius: 2,
            fontWeight: "bold",
          }}
          onClick={() => handleOpen()}
        >
          Créer un Usage
        </Button>

        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#1976D2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Produit</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Utilisateur</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date d'Usage</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Objet</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quantité Utilisée</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usages.map((usage) => {
                const product = products.find((p) => p.id === usage.product_id);
                const user = users.find((u) => u.id === usage.user_id);
                return (
                  <TableRow key={usage.id} hover>
                    <TableCell>{usage.id}</TableCell>
                    <TableCell>{product ? product.name : "Produit non trouvé"}</TableCell>
                    <TableCell>{user ? user.username : "Utilisateur non trouvé"}</TableCell>
                    <TableCell>{new Date(usage.usage_date).toLocaleDateString()}</TableCell>
                    <TableCell>{usage.purpose}</TableCell>
                    <TableCell>{usage.quantity_used}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton color="primary" onClick={() => handleOpen(usage)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => confirmDelete(usage)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialogue de confirmation pour la suppression */}
        <Dialog open={confirmDeleteDialog} onClose={handleCloseConfirmDelete}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer cet usage ?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDelete} color="secondary">Annuler</Button>
            <Button onClick={handleDelete} color="error">Supprimer</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editMode ? "Modifier l'Usage" : "Créer un Usage"}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="product-select-label">Produit</InputLabel>
              <Select
                labelId="product-select-label"
                value={newUsage.product_id}
                onChange={(e) => setNewUsage({ ...newUsage, product_id: +e.target.value })}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="user-select-label">Utilisateur</InputLabel>
              <Select
                labelId="user-select-label"
                value={newUsage.user_id}
                onChange={(e) => setNewUsage({ ...newUsage, user_id: +e.target.value })}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Date d'Usage"
              fullWidth
              type="datetime-local"
              value={newUsage.usage_date}
              onChange={(e) => setNewUsage({ ...newUsage, usage_date: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Objet"
              fullWidth
              value={newUsage.purpose}
              onChange={(e) => setNewUsage({ ...newUsage, purpose: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Quantité Utilisée"
              fullWidth
              type="number"
              value={newUsage.quantity_used}
              onChange={(e) => setNewUsage({ ...newUsage, quantity_used: +e.target.value })}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Annuler</Button>
            <Button variant="contained" color="success" onClick={handleSave}>
              {editMode ? "Mettre à Jour" : "Créer"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}