import React, { useState } from "react";
import {
  Button,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Crud = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [selected, setSelected] = useState([]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // "single" | "selected" | "all"
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Add or Update
  const handleAddOrUpdate = () => {
    if (name.trim() === "") return;

    if (editIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editIndex] = name;
      setItems(updatedItems);
      setEditIndex(null);
      setSnackbarMessage("Item updated successfully!");
    } else {
      setItems([...items, name]);
      setSnackbarMessage("Item added successfully!");
    }

    setName("");
    setSnackbarOpen(true);
  };

  // Edit item
  const handleEdit = (index) => {
    setName(items[index]);
    setEditIndex(index);
  };

  // Open delete dialog
  const handleOpenDialog = (type, index = null) => {
    setDeleteType(type);
    setDeleteIndex(index);
    setDialogOpen(true);
  };

  // Close delete dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (deleteType === "single" && deleteIndex !== null) {
      const updatedItems = items.filter((_, i) => i !== deleteIndex);
      setItems(updatedItems);
      setSelected(selected.filter((i) => i !== deleteIndex));
      setSnackbarMessage("Item deleted successfully!");
    } else if (deleteType === "selected") {
      const updatedItems = items.filter((_, i) => !selected.includes(i));
      setItems(updatedItems);
      setSelected([]);
      setSnackbarMessage("Selected items deleted successfully!");
    } else if (deleteType === "all") {
      setItems([]);
      setSelected([]);
      setSnackbarMessage("All items deleted successfully!");
    }

    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  // Multiple select toggle
  const handleSelect = (index) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  return (
    <Grid container direction="column" spacing={2} p={2}>
      <Grid item>
        <Typography variant="h4" align="center">
          React CRUD Application
        </Typography>
      </Grid>

      {/* Add / Update */}
      <Grid item container spacing={1} alignItems="center">
        <Grid item xs={8}>
          <TextField
            fullWidth
            placeholder="Enter item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddOrUpdate}
          >
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </Grid>
      </Grid>

      {/* Delete All / Delete Selected */}
      <Grid item container spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleOpenDialog("all")}
            disabled={items.length === 0}
          >
            Delete All
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleOpenDialog("selected")}
            disabled={selected.length === 0}
          >
            Delete Selected
          </Button>
        </Grid>
      </Grid>

      {/* Items Table */}
      {items.length > 0 ? (
        <Grid item>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={
                        selected.length === items.length && items.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected(items.map((_, i) => i));
                        } else {
                          setSelected([]);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(index)}
                        onChange={() => handleSelect(index)}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(index)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDialog("single", index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      ) : (
        <Grid item>
          <Typography variant="h6" align="center">
            No items found
          </Typography>
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteType === "single"
              ? "Are you sure you want to delete this item?"
              : deleteType === "selected"
              ? "Are you sure you want to delete selected items?"
              : "Are you sure you want to delete all items?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Crud;
