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

// Définition du type DeliveryType
interface DeliveryType {
  id: number;
  product_id: number;
  structure_name: string;
  quantity: number;
  amount_paid: number;
  delivery_date: string;
}

// Définition du type ProductType
interface ProductType {
  id: number;
  name: string;
}

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<DeliveryType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType | null>(null);
  const [newDelivery, setNewDelivery] = useState({ product_id: 0, structure_name: "", quantity: 0, amount_paid: 0, delivery_date: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deliveryToDelete, setDeliveryToDelete] = useState<DeliveryType | null>(null);

  useEffect(() => {
    fetchDeliveries();
    fetchProducts();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/deliveries/list");
      setDeliveries(response.data.deliveries || []);
    } catch (error) {
      console.error("Erreur lors du chargement des livraisons", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/products/listall");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Erreur lors du chargement des produits", error);
    }
  };

  const handleOpen = (delivery: DeliveryType | null = null) => {
    setEditMode(!!delivery);
    setSelectedDelivery(delivery);
    setNewDelivery(delivery ? { ...delivery } : { product_id: 0, structure_name: "", quantity: 0, amount_paid: 0, delivery_date: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!newDelivery.product_id || !newDelivery.structure_name || !newDelivery.quantity || !newDelivery.amount_paid || !newDelivery.delivery_date) {
      console.error("Tous les champs doivent être remplis.");
      return;
    }

    try {
      if (editMode && selectedDelivery) {
        await axios.put(`http://127.0.0.1:8000/deliveries/update/${selectedDelivery.id}`, newDelivery);
      } else {
        await axios.post("http://127.0.0.1:8000/deliveries/create", newDelivery);
      }
      await fetchDeliveries(); // Récupérer les livraisons mises à jour
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de la livraison", error);
    }
  };

  const confirmDelete = (delivery: DeliveryType) => {
    setDeliveryToDelete(delivery);
    setDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      if (deliveryToDelete) {
        await axios.delete(`http://127.0.0.1:8000/deliveries/delete/${deliveryToDelete.id}`);
        fetchDeliveries();
      }
      setDeleteDialog(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la livraison", error);
    }
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
          🚚 Livraisons
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
          Créer une Livraison
        </Button>

        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#1976D2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Produit</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nom de la Structure</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quantité</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Montant Payé</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date de Livraison</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveries.map((delivery) => {
                const product = products.find((p) => p.id === delivery.product_id);
                return (
                  <TableRow key={delivery.id} hover>
                    <TableCell>{delivery.id}</TableCell>
                    <TableCell>{product ? product.name : "Produit non trouvé"}</TableCell>
                    <TableCell>{delivery.structure_name}</TableCell>
                    <TableCell>{delivery.quantity}</TableCell>
                    <TableCell>{delivery.amount_paid} €</TableCell>
                    <TableCell>{new Date(delivery.delivery_date).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton color="primary" onClick={() => handleOpen(delivery)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => confirmDelete(delivery)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>Voulez-vous vraiment supprimer cette livraison ?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Annuler</Button>
            <Button color="error" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editMode ? "Modifier la Livraison" : "Créer une Livraison"}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="product-select-label">Produit</InputLabel>
              <Select
                labelId="product-select-label"
                value={newDelivery.product_id}
                onChange={(e) => setNewDelivery({ ...newDelivery, product_id: +e.target.value })}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Nom de la Structure"
              fullWidth
              value={newDelivery.structure_name}
              onChange={(e) => setNewDelivery({ ...newDelivery, structure_name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Quantité"
              fullWidth
              type="number"
              value={newDelivery.quantity}
              onChange={(e) => setNewDelivery({ ...newDelivery, quantity: +e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Montant Payé (€)"
              fullWidth
              type="number"
              value={newDelivery.amount_paid}
              onChange={(e) => setNewDelivery({ ...newDelivery, amount_paid: +e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Date de Livraison"
              fullWidth
              type="datetime-local"
              value={newDelivery.delivery_date}
              onChange={(e) => setNewDelivery({ ...newDelivery, delivery_date: e.target.value })}
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