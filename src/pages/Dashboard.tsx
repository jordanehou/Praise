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
import { Edit, Delete, AddBox, Category } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; title: string } | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: number; title: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/categories/list");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories", error);
    }
  };

  const handleOpen = (category: { id: number; title: string } | null = null) => {
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
        await axios.post(`http://127.0.0.1:8000/categories/update/${selectedCategory.id}`, { title: newCategory });
      } else {
        await axios.post("http://127.0.0.1:8000/categories/create", { title: newCategory });
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de la catégorie", error);
    }
  };

  const confirmDelete = (category: { id: number; title: string }) => {
    //setCategoryToDelete(category);
    setDeleteDialog(true);
    handleDelete(category);
    //setSelectedCategory(category);
  };

  const handleDelete = async (category: { id: number; title: string } | null = null) => {
    try {
      if (category) {
        await axios.delete(`http://127.0.0.1:8000/categories/delete/${category.id}`);
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
                      <Category sx={{ color: "#1565C0", mr: 1 }} />
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
                      Ajouter un Produit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
            {/* <Button onClick={handleSave} color="primary">{editMode ? "Mettre à Jour" : "Ajouter"}</Button> */}
            <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ ml: 1, borderRadius: 2, fontWeight: "bold" }}
                      onClick={handleSave}
                    >
                     {editMode ? "Mettre à Jour" : "Ajouter"}
                    </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
