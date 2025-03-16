// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Container,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Box,
// } from "@mui/material";
// import { Edit, Delete, AddBox, Inventory as ProductIcon, ArrowBack } from "@mui/icons-material";
// import Sidebar from "../components/Sidebar";

// // Définition du type ProductType
// interface ProductType {
//   id: number;
//   name: string;
//   description: string;
//   category_id: number;
//   quantity: number;
//   unit_price: number;
//   image_path: string; // Ajout du chemin d'image
// }

// // Étendre le type de newProduct
// interface NewProductType {
//   name: string;
//   description: string;
//   quantity: number;
//   unit_price: number;
//   image: File | null; // Permettre à `image` d'être un objet File ou null
// }

// export default function ProductDashboard() {
//   const { categoryId } = useParams();
//   const navigate = useNavigate();
//   const [products, setProducts] = useState<ProductType[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
//   const [newProduct, setNewProduct] = useState<NewProductType>({ name: "", description: "", quantity: 0, unit_price: 0, image: null });
//   const [deleteDialog, setDeleteDialog] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<ProductType | null>(null);

//   useEffect(() => {
//     fetchProducts();
//   }, [categoryId]);

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/products/listcategory/${categoryId}`);
//       setProducts(response.data.products || []);
//     } catch (error) {
//       console.error("Erreur lors du chargement des produits", error);
//     }
//   };

//   const handleOpen = (product: ProductType | null = null) => {
//     setEditMode(!!product);
//     setSelectedProduct(product);
//     setNewProduct(product ? { ...product, image: null } : { name: "", description: "", quantity: 0, unit_price: 0, image: null }); // Réinitialiser l'image
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleSave = async () => {
//     const formData = new FormData(); // Utilisation de FormData pour l'envoi de fichiers
//     formData.append("name", newProduct.name);
//     formData.append("description", newProduct.description);
//     formData.append("quantity", String(newProduct.quantity));
//     formData.append("unit_price", String(newProduct.unit_price));
    
//     // Vérification de categoryId pour éviter undefined
//     if (categoryId) {
//       formData.append("category_id", categoryId);
//     } else {
//       console.error("categoryId is undefined");
//       return; // Ou gérer une manière alternative
//     }
  
//     if (newProduct.image) {
//       formData.append("image", newProduct.image); // Ajout de l'image si disponible
//     }
  
//     try {
//       const url = editMode && selectedProduct
//         ? `http://127.0.0.1:8000/products/update/${selectedProduct.id}`
//         : "http://127.0.0.1:8000/products/create";
  
//       await axios.post(url, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
  
//       fetchProducts();
//       handleClose();
//     } catch (error) {
//       console.error("Erreur lors de l'ajout/modification du produit", error);
//     }
//   };

//   const confirmDelete = (product: ProductType) => {
//     setProductToDelete(product);
//     setDeleteDialog(true);
//   };

//   const handleDelete = async () => {
//     try {
//       if (productToDelete) {
//         await axios.delete(`http://127.0.0.1:8000/products/delete/${productToDelete.id}`);
//         setProducts(products.filter(product => product.id !== productToDelete.id));
//       }
//       setDeleteDialog(false);
//     } catch (error) {
//       console.error("Erreur lors de la suppression du produit", error);
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", height: "100vh", background: "#f4f6f8" }}>
//       <Sidebar />
//       <Container sx={{ flexGrow: 1, padding: 4, maxWidth: "90%", marginRight: "5%" }}>
//         <Button
//           sx={{
//             mb: 2,
//             borderRadius: 2,
//             fontWeight: "bold",
//             color: "#1565C0",
//             background: "transparent",
//             display: "flex",
//             alignItems: "center",
//             boxShadow: "none",
//             ":hover": { background: "rgba(21, 101, 192, 0.1)" },
//           }}
//           onClick={() => navigate("/dashboard")}
//         >
//           <ArrowBack sx={{ mr: 1 }} />
//           Retour aux Catégories
//         </Button>

//         <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1565C0" }}>
//           📦 Produits de la Catégorie {categoryId}
//         </Typography>

//         <Button
//           variant="contained"
//           startIcon={<AddBox />}
//           sx={{
//             bgcolor: "#1565C0",
//             ":hover": { bgcolor: "#0d47a1" },
//             mb: 2,
//             borderRadius: 2,
//             fontWeight: "bold",
//           }}
//           onClick={() => handleOpen()}
//         >
//           Ajouter un Produit
//         </Button>

//         {/* <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
//           <Table>
//             <TableHead sx={{ bgcolor: "#1976D2" }}>
//               <TableRow>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nom</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quantité</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Prix Unitaire</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {products.map((product) => (
//                 <TableRow key={product.id} hover>
//                   <TableCell>{product.id}</TableCell>
//                   <TableCell>
//                     <Box display="flex" alignItems="center">
//                       <ProductIcon sx={{ color: "#1565C0", mr: 1 }} />
//                       {product.name}
//                     </Box>
//                   </TableCell>
//                   <TableCell>{product.description}</TableCell>
//                   <TableCell>{product.quantity}</TableCell>
//                   <TableCell>{product.unit_price} €</TableCell>
//                   <TableCell sx={{ textAlign: "center" }}>
//                     <IconButton color="primary" onClick={() => handleOpen(product)}>
//                       <Edit />
//                     </IconButton>
//                     <IconButton color="error" onClick={() => confirmDelete(product)}>
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer> */}



//         <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
//           <Table>
//             <TableHead sx={{ bgcolor: "#1976D2" }}>
//               <TableRow>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nom</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quantité</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Prix Unitaire</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Image</TableCell> {/* Nouvelle colonne pour l'image */}
//                 <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {products.map((product) => (
//                 <TableRow key={product.id} hover>
//                   <TableCell>{product.id}</TableCell>
//                   <TableCell>
//                     <Box display="flex" alignItems="center">
//                       <ProductIcon sx={{ color: "#1565C0", mr: 1 }} />
//                       {product.name}
//                     </Box>
//                   </TableCell>
//                   <TableCell>{product.description}</TableCell>
//                   <TableCell>{product.quantity}</TableCell>
//                   <TableCell>{product.unit_price} €</TableCell>
//                   <TableCell>
//                     {product.image_path && (
//                       <img
//                         src={`http://127.0.0.1:8000/${product.image_path}`} // Chemin d'accès à l'image
//                         alt={product.name}
//                         style={{ width: '50px', height: '50px', objectFit: 'cover' }} // Style pour l'image
//                       />
//                     )}
//                   </TableCell>
//                   <TableCell sx={{ textAlign: "center" }}>
//                     <IconButton color="primary" onClick={() => handleOpen(product)}>
//                       <Edit />
//                     </IconButton>
//                     <IconButton color="error" onClick={() => confirmDelete(product)}>
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer> 

//         {/* Boîte de dialogue pour confirmation de suppression */}
//         <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
//           <DialogTitle>Confirmation</DialogTitle>
//           <DialogContent>Voulez-vous vraiment supprimer ce produit ?</DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDeleteDialog(false)}>Annuler</Button>
//             <Button color="error" onClick={handleDelete}>
//               Supprimer
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Boîte de dialogue pour ajouter/modifier un produit */}
//         <Dialog open={open} onClose={handleClose}>
//           <DialogTitle>{editMode ? "Modifier le Produit" : "Ajouter un Produit"}</DialogTitle>
//           <DialogContent>
//             <TextField label="Nom" fullWidth value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
//             <TextField label="Description" fullWidth multiline rows={2} sx={{ mt: 2 }} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
//             <TextField label="Quantité" fullWidth type="number" sx={{ mt: 2 }} value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })} />
//             <TextField label="Prix Unitaire" fullWidth type="number" sx={{ mt: 2 }} value={newProduct.unit_price} onChange={(e) => setNewProduct({ ...newProduct, unit_price: Number(e.target.value) })} />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 if (e.target.files && e.target.files[0]) {
//                   setNewProduct({ ...newProduct, image: e.target.files[0] });
//                 }
//               }}
//               style={{ marginTop: '16px' }}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Annuler</Button>
//             <Button onClick={handleSave}>
//               {editMode ? "Modifier" : "Ajouter"}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </Box>
//   );
// }




// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Container,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Box,
// } from "@mui/material";
// import { Edit, Delete, AddBox, Inventory as ProductIcon, ArrowBack } from "@mui/icons-material";
// import Sidebar from "../components/Sidebar";

// // Définition du type ProductType
// interface ProductType {
//   id: number;
//   name: string;
//   description: string;
//   category_id: number;
//   quantity: number;
//   unit_price: number;
//   image_path: string; // Ajout du chemin d'image
// }

// // Étendre le type de newProduct
// interface NewProductType {
//   name: string;
//   description: string;
//   quantity: number;
//   unit_price: number;
//   image: File | null; // Permettre à `image` d'être un objet File ou null
// }

// export default function ProductDashboard() {
//   const { categoryId } = useParams();
//   const navigate = useNavigate();
//   const [products, setProducts] = useState<ProductType[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
//   const [newProduct, setNewProduct] = useState<NewProductType>({ name: "", description: "", quantity: 0, unit_price: 0, image: null });
//   const [deleteDialog, setDeleteDialog] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<ProductType | null>(null);

//   useEffect(() => {
//     fetchProducts();
//   }, [categoryId]);

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/products/listcategory/${categoryId}`);
//       setProducts(response.data.products || []);
//     } catch (error) {
//       console.error("Erreur lors du chargement des produits", error);
//     }
//   };

//   const handleOpen = (product: ProductType | null = null) => {
//     setEditMode(!!product);
//     setSelectedProduct(product);
//     setNewProduct(product ? { ...product, image: null } : { name: "", description: "", quantity: 0, unit_price: 0, image: null }); // Réinitialiser l'image
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleSave = async () => {
//     const formData = new FormData(); // Utilisation de FormData pour l'envoi de fichiers
//     formData.append("name", newProduct.name);
//     formData.append("description", newProduct.description);
//     formData.append("quantity", String(newProduct.quantity));
//     formData.append("unit_price", String(newProduct.unit_price));
    
//     // Vérification de categoryId pour éviter undefined
//     if (categoryId) {
//       formData.append("category_id", categoryId);
//     } else {
//       console.error("categoryId is undefined");
//       return; // Ou gérer une manière alternative
//     }
  
//     if (newProduct.image) {
//       formData.append("image", newProduct.image); // Ajout de l'image si disponible
//     }
  
//     try {
//       const url = editMode && selectedProduct
//         ? `http://127.0.0.1:8000/products/update/${selectedProduct.id}`
//         : "http://127.0.0.1:8000/products/create";
  
//       await axios.post(url, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
  
//       fetchProducts();
//       handleClose();
//     } catch (error) {
//       console.error("Erreur lors de l'ajout/modification du produit", error);
//     }
//   };

//   const confirmDelete = (product: ProductType) => {
//     setProductToDelete(product);
//     setDeleteDialog(true);
//   };

//   const handleDelete = async () => {
//     try {
//       if (productToDelete) {
//         await axios.delete(`http://127.0.0.1:8000/products/delete/${productToDelete.id}`);
//         setProducts(products.filter(product => product.id !== productToDelete.id));
//       }
//       setDeleteDialog(false);
//     } catch (error) {
//       console.error("Erreur lors de la suppression du produit", error);
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", height: "100vh", background: "#f4f6f8" }}>
//       <Sidebar />
//       <Container sx={{ flexGrow: 1, padding: 4, maxWidth: "90%", marginRight: "5%" }}>
//         <Button
//           sx={{
//             mb: 2,
//             borderRadius: 2,
//             fontWeight: "bold",
//             color: "#1565C0",
//             background: "transparent",
//             display: "flex",
//             alignItems: "center",
//             boxShadow: "none",
//             ":hover": { background: "rgba(21, 101, 192, 0.1)" },
//           }}
//           onClick={() => navigate("/dashboard")}
//         >
//           <ArrowBack sx={{ mr: 1 }} />
//           Retour aux Catégories
//         </Button>

//         <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1565C0" }}>
//           📦 Produits de la Catégorie {categoryId}
//         </Typography>

//         <Button
//           variant="contained"
//           startIcon={<AddBox />}
//           sx={{
//             bgcolor: "#1565C0",
//             ":hover": { bgcolor: "#0d47a1" },
//             mb: 2,
//             borderRadius: 2,
//             fontWeight: "bold",
//           }}
//           onClick={() => handleOpen()}
//         >
//           Ajouter un Produit
//         </Button>

//         <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
//           <Table>
//             <TableHead sx={{ bgcolor: "#1976D2" }}>
//               <TableRow>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nom</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quantité</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Prix Unitaire</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Image</TableCell> {/* Nouvelle colonne pour l'image */}
//                 <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {products.map((product) => (
//                 <TableRow key={product.id} hover>
//                   <TableCell>{product.id}</TableCell>
//                   <TableCell>
//                     <Box display="flex" alignItems="center">
//                       <ProductIcon sx={{ color: "#1565C0", mr: 1 }} />
//                       {product.name}
//                     </Box>
//                   </TableCell>
//                   <TableCell>{product.description}</TableCell>
//                   <TableCell>{product.quantity}</TableCell>
//                   <TableCell>{product.unit_price} €</TableCell>
//                   <TableCell>
//                     {product.image_path && (
//                       <img
//                       src={`http://127.0.0.1:8000/static/images/products/${product.image_path}`} // Vérifiez que le chemin est correct
//                         alt={product.name}
//                         style={{ width: '50px', height: '50px', objectFit: 'cover' }} // Style pour l'image
//                       />
//                     )}
//                   </TableCell>
//                   <TableCell sx={{ textAlign: "center" }}>
//                     <IconButton color="primary" onClick={() => handleOpen(product)}>
//                       <Edit />
//                     </IconButton>
//                     <IconButton color="error" onClick={() => confirmDelete(product)}>
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Boîte de dialogue pour confirmation de suppression */}
//         <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
//           <DialogTitle>Confirmation</DialogTitle>
//           <DialogContent>Voulez-vous vraiment supprimer ce produit ?</DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDeleteDialog(false)}>Annuler</Button>
//             <Button color="error" onClick={handleDelete}>
//               Supprimer
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Boîte de dialogue pour ajouter/modifier un produit */}
//         <Dialog open={open} onClose={handleClose}>
//           <DialogTitle>{editMode ? "Modifier le Produit" : "Ajouter un Produit"}</DialogTitle>
//           <DialogContent>
//             <TextField label="Nom" fullWidth value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
//             <TextField label="Description" fullWidth multiline rows={2} sx={{ mt: 2 }} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
//             <TextField label="Quantité" fullWidth type="number" sx={{ mt: 2 }} value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })} />
//             <TextField label="Prix Unitaire" fullWidth type="number" sx={{ mt: 2 }} value={newProduct.unit_price} onChange={(e) => setNewProduct({ ...newProduct, unit_price: Number(e.target.value) })} />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 if (e.target.files && e.target.files[0]) {
//                   setNewProduct({ ...newProduct, image: e.target.files[0] });
//                 }
//               }}
//               style={{ marginTop: '16px' }}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Annuler</Button>
//             <Button onClick={handleSave}>
//               {editMode ? "Modifier" : "Ajouter"}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </Box>
//   );
// }




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
  image_path: string; // Chemin d'image
}

// Étendre le type de newProduct
interface NewProductType {
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  image: File | null; // Permettre à `image` d'être un objet File ou null
}

export default function ProductDashboard() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [newProduct, setNewProduct] = useState<NewProductType>({ name: "", description: "", quantity: 0, unit_price: 0, image: null });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductType | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

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
    setNewProduct(product ? { ...product, image: null } : { name: "", description: "", quantity: 0, unit_price: 0, image: null });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleSave = async () => {
  //   const formData = new FormData();
  //   formData.append("name", newProduct.name);
  //   formData.append("description", newProduct.description);
  //   formData.append("quantity", String(newProduct.quantity));
  //   formData.append("unit_price", String(newProduct.unit_price));
    
  //   if (categoryId) {
  //     formData.append("category_id", categoryId);
  //   } else {
  //     console.error("categoryId is undefined");
  //     return;
  //   }
  
  //   if (newProduct.image) {
  //     formData.append("image", newProduct.image);
  //   }
  
  //   try {
  //     const url = editMode && selectedProduct
  //       ? `http://127.0.0.1:8000/products/update/${selectedProduct.id}`
  //       : "http://127.0.0.1:8000/products/create";
  
  //     await axios.post(url, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  
  //     fetchProducts();
  //     handleClose();
  //   } catch (error) {
  //     console.error("Erreur lors de l'ajout/modification du produit", error);
  //   }
  // };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("quantity", String(newProduct.quantity));
    formData.append("unit_price", String(newProduct.unit_price));
    
    if (categoryId) {
      formData.append("category_id", categoryId);
    } else {
      console.error("categoryId is undefined");
      return;
    }
  
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }
  
    try {
      // Déterminez l'URL et la méthode en fonction du mode d'édition
      const url = editMode && selectedProduct
        ? `http://127.0.0.1:8000/products/update/${selectedProduct.id}`
        : "http://127.0.0.1:8000/products/create";
      
      const method = editMode && selectedProduct ? 'put' : 'post'; // Choisissez la méthode

      // Utilisez axios avec la méthode appropriée
      await axios({
        method: method,
        url: url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
  
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

  const handleDelete = async () => {
    try {
      if (productToDelete) {
        await axios.delete(`http://127.0.0.1:8000/products/delete/${productToDelete.id}`);
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
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Image</TableCell>
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
                  <TableCell>
                    {product.image_path && (
                      <img
                      src={`http://127.0.0.1:8000/${product.image_path}`} // Chemin d'accès à l'image
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} // Style pour l'image
                      />
                    )}
                  </TableCell>
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
            <TextField label="Quantité" fullWidth type="number" sx={{ mt: 2 }} value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })} />
            <TextField label="Prix Unitaire" fullWidth type="number" sx={{ mt: 2 }} value={newProduct.unit_price} onChange={(e) => setNewProduct({ ...newProduct, unit_price: Number(e.target.value) })} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNewProduct({ ...newProduct, image: e.target.files[0] });
                }
              }}
              style={{ marginTop: '16px' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button onClick={handleSave}>
              {editMode ? "Modifier" : "Ajouter"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}