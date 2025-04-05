import React from 'react';
import Sidebar from '../../components/Sidebar';

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

const Home: React.FC = () => {

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
    <>
        {/* <Sidebar/> */}

        <nav className="navbar navbar-expand-lg bg-white navbar-light shadow-sm px-5 py-3 py-lg-0 fixed-top">
          <a href="index.html" className="navbar-brand p-0">
            <h1 className="m-0 text-primary">
              <i className="fa fa-tooth me-2"></i>DentCare
            </h1>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
              <a href="index.html" className="nav-item nav-link active">
                Home
              </a>
              <a href="about.html" className="nav-item nav-link">
                About
              </a>
              <a href="service.html" className="nav-item nav-link">
                Service
              </a>
              <div className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Pages
                </a>
                <div className="dropdown-menu m-0">
                  <a href="price.html" className="dropdown-item">
                    Pricing Plan
                  </a>
                  <a href="team.html" className="dropdown-item">
                    Our Dentist
                  </a>
                  <a href="testimonial.html" className="dropdown-item">
                    Testimonial
                  </a>
                  <a href="appointment.html" className="dropdown-item">
                    Appointment
                  </a>
                </div>
              </div>
              <a href="contact.html" className="nav-item nav-link">
                Contact
              </a>
            </div>
            <button
              type="button"
              className="btn text-dark"
              data-bs-toggle="modal"
              data-bs-target="#searchModal"
            >
              <i className="fa fa-search"></i>
            </button>
            <a href="appointment.html" className="btn btn-primary py-2 px-4 ms-3">
              Appointment
            </a>
          </div>
        </nav>

    




      <div className="container-fluid py-1">
      <div className=" wow slideInUp" data-wow-delay="0.1s">
            <div className="section-title bg-light rounded h-100 p-5">
            <h5 className="position-relative d-inline-block text-primary text-uppercase">Our Dentist</h5>
            <h1 className="display-6 mb-4">Meet Our Certified & Experienced Dentist</h1>
            <a href="appointment.html" className="btn btn-primary py-3 px-5">Appointment</a>
            </div>
        </div>
        <div className="container">

        <div className="row ">


        {categories.map((category) => ( 
              <div className="col-lg-4 wow slideInUp" data-wow-delay={`${0.1 * (category.id + 1)}s`} key={category.id}>


                {productsByCategory[category.id]?.map((product) => (
                <div className="team-item">
                  <div className="position-relative rounded-top" style={{ zIndex: 1 }}>
                    <img className="img-fluid rounded-top w-100" src={`http://127.0.0.1:8000/${product.image_path}`} alt="Dentist" />
                    <div className="position-absolute top-100 start-50 translate-middle bg-light rounded p-2 d-flex">


                      {['twitter', 'facebook-f', 'linkedin-in', 'instagram'].map((social, i) => (
                        <a key={i} className="btn btn-primary btn-square m-1" href="#">
                          <i className={`fab fa-${social} fw-normal`}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="team-text position-relative bg-light text-center rounded-bottom p-4 pt-5">
                    <h4 className="mb-2">{product.name}</h4>
                    <p className="text-primary mb-0">{product.description}</p>
                  </div>
                  <Button size="small" onClick={() => handleOpen(product)}>
                          Détails
                    </Button>
                </div>

                ))}

              </div>
            ))}



 
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
