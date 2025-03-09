import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

export default function DeliveryDashboard() {
  //const [deliveries, setDeliveries] = useState([]);
  const [open, setOpen] = useState(false);
  const [newDelivery, setNewDelivery] = useState({ structure_name: "", delivery_date: "", quantity: 0, amount_paid: 0 });
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  type Delivery = {
    id: number;
    structure_name: string;
    delivery_date: string;
    quantity: number;
    amount_paid: number;
  };
  
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/deliveries/");
      setDeliveries(response.data.deliveries);
    } catch (error) {
      console.error("Erreur lors du chargement des livraisons", error);
    }
  };

  const handleCreateDelivery = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/deliveries/create", newDelivery);
      fetchDeliveries();
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création de la livraison", error);
    }
  };

  return (
    <div>
      <h1>Gestion des Livraisons</h1>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Ajouter une Livraison
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Structure</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Quantité</TableCell>
            <TableCell>Montant</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell>{delivery.id}</TableCell>
              <TableCell>{delivery.structure_name}</TableCell>
              <TableCell>{delivery.delivery_date}</TableCell>
              <TableCell>{delivery.quantity}</TableCell>
              <TableCell>{delivery.amount_paid}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Ajouter une Livraison</DialogTitle>
        <DialogContent>
          <TextField label="Structure" fullWidth onChange={(e) => setNewDelivery({ ...newDelivery, structure_name: e.target.value })} />
          <TextField label="Date" type="date" fullWidth onChange={(e) => setNewDelivery({ ...newDelivery, delivery_date: e.target.value })} />
          <TextField label="Quantité" type="number" fullWidth onChange={(e) => setNewDelivery({ ...newDelivery, quantity: parseInt(e.target.value) })} />
          <TextField label="Montant" type="number" fullWidth onChange={(e) => setNewDelivery({ ...newDelivery, amount_paid: parseFloat(e.target.value) })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleCreateDelivery} color="primary">Ajouter</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
