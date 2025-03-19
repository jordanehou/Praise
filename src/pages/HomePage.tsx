import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LaboratoryIcon from '@mui/icons-material/LocalPharmacy'; // Icône pour les produits médicaux
import Sidebar from "../components/Sidebar";

interface CategoryType {
  id: number;
  title: string;
}

interface ProductType {
  id: number;
  name: string;
  description: string;
  category_id: number;
  quantity: number;
  unit_price: number;
  image_path: string; // Chemin d'image
}

interface DeliveryType {
  id: number;
  structure_name: string;
  delivery_date: string;
  quantity: number;
  amount_paid: number;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<{ [key: number]: ProductType[] }>({});
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // État pour l'authentification

  useEffect(() => {
    fetchCategories();
    checkAuthentication(); // Vérifiez l'état de l'utilisateur
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/categories/list"); // Remplacez par l'URL de votre API
      setCategories(response.data.categories || []);
      // Fetch products for each category
      response.data.categories.forEach((category: CategoryType) => {
        fetchProductsByCategory(category.id);
      });
    } catch (error) {
      console.error("Erreur lors du chargement des catégories", error);
    }
  };

  const fetchProductsByCategory = useCallback(async (categoryId: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/products/listcategory/${categoryId}`);
      setProductsByCategory(prev => ({
        ...prev,
        [categoryId]: response.data.products || [],
      }));
    } catch (error) {
      console.error(`Erreur lors du chargement des produits pour la catégorie ${categoryId}`, error);
    }
  }, []);

  const handleOpen = (product: ProductType) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const checkAuthentication = () => {
    const token = localStorage.getItem("token"); // Exemple d'authentification par token
    setIsAuthenticated(!!token); // Met à jour l'état en fonction de la présence d'un token
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Exemple de suppression du token
    setIsAuthenticated(false); // Met à jour l'état
    navigate("/login"); // Redirige vers la page de connexion
  };

  return (
    <div className="div" style={{ backgroundColor: "#eef2f3", minHeight: "100vh", maxWidth: "100%", padding:0, margin:0 }}>
      <Box sx={{ display: "flex", minHeight: "100vh", background: "#eef2f3" , maxWidth: '100%', padding:0, margin:0}}>
        {isAuthenticated && (<Sidebar />)}
        <Container sx={{ padding: 4, minHeight: '100vh', maxWidth: '100%', backgroundColor: "#eef2f3" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#1976D2" }}>
              LEMS
            </Typography>
            <Box>
              {isAuthenticated ? (
                <Button variant="contained" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="outlined" sx={{ mr: 2 }} onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button variant="contained" onClick={() => navigate("/register")}>
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Box>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976D2", mb: 2 }}>
            Catégories de Produits
          </Typography>

          {categories.map((category) => (
            <Box key={category.id} sx={{ mb: 4, padding: 2, borderRadius: 2, backgroundColor: "#fff", boxShadow: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976D2", display: "flex", alignItems: "center", mb: 2 }}>
                <LaboratoryIcon sx={{ mr: 1 }} /> {category.title}
              </Typography>
              <Grid container spacing={2}>
                {productsByCategory[category.id]?.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={`http://127.0.0.1:8000/${product.image_path}`} // Chemin d'accès à l'image
                        alt={product.name}
                      />
                      <CardContent>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => handleOpen(product)}>
                          Détails
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          {/* Modal pour afficher les détails du produit */}
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogContent>
              {selectedProduct && (
                <>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://127.0.0.1:8000/${selectedProduct.image_path}`}
                    alt={selectedProduct.name}
                  />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {selectedProduct.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Prix: {selectedProduct.unit_price} €
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Quantité disponible: {selectedProduct.quantity}
                  </Typography>
                  {/* Afficher les livraisons associées ici si nécessaire */}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Fermer</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </div>
  );
}