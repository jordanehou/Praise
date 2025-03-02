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
import { AccountCircle, Lock } from "@mui/icons-material";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/users/login", formData);
      console.log("Login success", response.data);

      // Stocker le token et l'utilisateur
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
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
            🔬 Connexion au Laboratoire
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

            {error && <Typography color="error" align="center" sx={{ mt: 1 }}>{error}</Typography>}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, bgcolor: "#1565C0", ":hover": { bgcolor: "#0d47a1" } }}
            >
              Se connecter
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
