import { useState, useEffect } from "react";
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
} from "@mui/material";
import { Edit, Delete, AddBox, Category as CategoryIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

// Définition du type CategoryType
interface CategoryType {
  id: number;
  title: string;
}

export default function Dashboard() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fonction pour récupérer les catégories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/categories/list");
      console.log("Données reçues:", response.data); // Debug pour voir la structure de l'API
      setCategories(response.data.categories || []); // S'assurer que c'est un tableau
    } catch (error) {
      console.error("Erreur lors du chargement des catégories", error);
    }
  };

  const handleOpen = (category: CategoryType | null = null) => {
    setEditMode(!!category);
    setSelectedCategory(category);
    setNewCategory(category ? category.title : "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      if (editMode && selectedCategory) {
        await axios.put(`http://127.0.0.1:8000/categories/update/${selectedCategory.id}`, { title: newCategory });
      } else {
        await axios.post("http://127.0.0.1:8000/categories/create", { title: newCategory });
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de la catégorie", error);
    }
  };

  // Fonction pour ouvrir la boîte de dialogue de confirmation avant suppression
  const confirmDelete = (category: CategoryType) => {
    setCategoryToDelete(category);
    setDeleteDialog(true);
  };

  // Fonction pour supprimer la catégorie après confirmation
  const handleDelete = async () => {
    try {
      if (categoryToDelete) {
        await axios.delete(`http://127.0.0.1:8000/categories/delete/${categoryToDelete.id}`);
        fetchCategories();
      }
      setDeleteDialog(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "#f4f6f8" }}>
      <Sidebar />
      <Container sx={{ flexGrow: 1, padding: 4, maxWidth: "90%", marginRight: "5%" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1565C0" }}>
          🗂️ Gestion des Catégories
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
          Ajouter une Catégorie
        </Button>

        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#1976D2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nom de la Catégorie</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <CategoryIcon sx={{ color: "#1565C0", mr: 1 }} />
                      {category.title}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton color="primary" onClick={() => handleOpen(category)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => confirmDelete(category)}>
                      <Delete />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ ml: 1, borderRadius: 2, fontWeight: "bold" }}
                      onClick={() => navigate(`/products/${category.id}`)}
                    >
                      Voir Produit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Boîte de dialogue pour confirmation de suppression */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>Voulez-vous vraiment supprimer cette catégorie ?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Annuler</Button>
            <Button color="error" onClick={handleDelete}>Supprimer</Button>
          </DialogActions>
        </Dialog>

        {/* Boîte de dialogue pour ajouter/modifier une catégorie */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editMode ? "Modifier la Catégorie" : "Ajouter une Catégorie"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom de la Catégorie"
              fullWidth
              variant="outlined"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Annuler</Button>
            <Button variant="contained" color="success" sx={{ ml: 1, borderRadius: 2, fontWeight: "bold" }} onClick={handleSave}>
              {editMode ? "Mettre à Jour" : "Ajouter"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
