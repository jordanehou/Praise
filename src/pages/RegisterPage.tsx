import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccountCircle, Email, Lock, AdminPanelSettings } from "@mui/icons-material";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/users/register", formData);
      console.log("Register success", response.data);
      navigate("/login"); // Rediriger vers la page de connexion
    } catch (err) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #d7e8ff, #a5c4ff)",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1565C0" }}>
            🏥 Inscription au Laboratoire
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Mot de passe"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Rôle"
              name="role"
              value={formData.role}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AdminPanelSettings color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            {error && <Typography color="error" align="center" sx={{ mt: 1 }}>{error}</Typography>}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, bgcolor: "#1565C0", ":hover": { bgcolor: "#0d47a1" } }}
            >
              S'inscrire
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
