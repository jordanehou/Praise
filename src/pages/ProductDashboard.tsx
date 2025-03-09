import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Edit, Delete, AddBox, Inventory as ProductIcon, ArrowBack } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";

// Définition du type ProductType
interface ProductType {
  id: number;
  name: string;
  description: string;
  category_id: number;
  quantity: number;
  unit_price: number;
}

export default function ProductDashboard() {
  const { categoryId } = useParams(); // Récupérer l'ID de la catégorie depuis l'URL
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", quantity: 0, unit_price: 0 });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductType | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  // Récupérer les produits de la catégorie en utilisant l'ID de la catégorie dans l'URL
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/products/listcategory/${categoryId}`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Erreur lors du chargement des produits", error);
    }
  };

  const handleOpen = (product: ProductType | null = null) => {
    setEditMode(!!product);
    setSelectedProduct(product);
    setNewProduct(product ? { ...product } : { name: "", description: "", quantity: 0, unit_price: 0 });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      if (editMode && selectedProduct) {
        await axios.put(`http://127.0.0.1:8000/products/update/${selectedProduct.id}`, {
          ...newProduct,
          category_id: categoryId,
        });
      } else {
        await axios.post("http://127.0.0.1:8000/products/create", {
          ...newProduct,
          category_id: categoryId,
        });
      }
      fetchProducts();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification du produit", error);
    }
  };

  const confirmDelete = (product: ProductType) => {
    setProductToDelete(product);
    setDeleteDialog(true);
  };

//   const handleDelete = async () => {
//     try {
//       if (productToDelete) {
//         await axios.delete(`http://127.0.0.1:8000/products/delete/${productToDelete.id}`);
//         fetchProducts();
//       }
//       setDeleteDialog(false);
//     } catch (error) {
//       console.error("Erreur lors de la suppression du produit", error);
//     }
//   };

    const handleDelete = async () => {
        try {
        if (productToDelete) {
            await axios.delete(`http://127.0.0.1:8000/products/delete/${productToDelete.id}`);
            
            // Mise à jour locale sans attendre un refetch
            setProducts(products.filter(product => product.id !== productToDelete.id));
        }
        setDeleteDialog(false);
        } catch (error) {
        console.error("Erreur lors de la suppression du produit", error);
        }
    };
  return (
    <Box sx={{ display: "flex", height: "100vh", background: "#f4f6f8" }}>
      <Sidebar />
      <Container sx={{ flexGrow: 1, padding: 4, maxWidth: "90%", marginRight: "5%" }}>
        {/* Bouton pour revenir aux catégories
        <Button
          variant="outlined"
          sx={{ mb: 2, borderRadius: 2, fontWeight: "bold", color: "#1565C0", borderColor: "#1565C0" }}
          onClick={() => navigate("/dashboard")}
        >
          Retour aux Catégories
        </Button> */}

                {/* Bouton pour revenir aux catégories sans bordure */}
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
          📦 Produits de la Catégorie {categoryId}
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
          Ajouter un Produit
        </Button>

        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#1976D2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nom</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quantité</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Prix Unitaire</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <ProductIcon sx={{ color: "#1565C0", mr: 1 }} />
                      {product.name}
                    </Box>
                  </TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.unit_price} €</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton color="primary" onClick={() => handleOpen(product)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => confirmDelete(product)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Boîte de dialogue pour confirmation de suppression */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>Voulez-vous vraiment supprimer ce produit ?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Annuler</Button>
            <Button color="error" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Boîte de dialogue pour ajouter/modifier un produit */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editMode ? "Modifier le Produit" : "Ajouter un Produit"}</DialogTitle>
          <DialogContent>
            <TextField label="Nom" fullWidth value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            <TextField label="Description" fullWidth multiline rows={2} sx={{ mt: 2 }} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
            <TextField label="Quantité" fullWidth type="number" sx={{ mt: 2 }} value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: +e.target.value })} />
            <TextField label="Prix Unitaire (€)" fullWidth type="number" sx={{ mt: 2 }} value={newProduct.unit_price} onChange={(e) => setNewProduct({ ...newProduct, unit_price: +e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Annuler</Button>
            <Button variant="contained" color="success" onClick={handleSave}>
              {editMode ? "Mettre à Jour" : "Ajouter"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
