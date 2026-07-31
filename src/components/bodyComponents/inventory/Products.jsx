import {
  Typography,
  Box,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Product from "./Product";
import { DataGrid } from "@mui/x-data-grid";
import { Search, Add, Edit, Delete } from "@mui/icons-material";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Dialog State
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: null, title: "", category: "", price: "", stock: "" });

  useEffect(() => {
    fetchProducts();
  }, [paginationModel, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    const { page, pageSize } = paginationModel;
    const skip = page * pageSize;
    let url = `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`;
    
    if (searchQuery) {
      url = `https://dummyjson.com/products/search?q=${searchQuery}&limit=${pageSize}&skip=${skip}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setSearchQuery(inputValue);
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentProduct({ id: null, title: "", category: "", price: "", stock: "" });
    setOpenModal(true);
  };

  const handleOpenEdit = (productRow) => {
    setEditMode(true);
    setCurrentProduct(productRow);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSaveProduct = async () => {
    if (editMode) {
      // Update
      try {
        await fetch(`https://dummyjson.com/products/${currentProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: currentProduct.title,
            category: currentProduct.category,
            price: Number(currentProduct.price),
            stock: Number(currentProduct.stock),
          })
        });
      } catch (err) {
        console.error("Error updating product API", err);
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === currentProduct.id ? { ...p, ...currentProduct } : p))
      );
    } else {
      // Add
      try {
        const res = await fetch('https://dummyjson.com/products/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: currentProduct.title,
            category: currentProduct.category,
            price: Number(currentProduct.price),
            stock: Number(currentProduct.stock),
          })
        });
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
        setTotal((prev) => prev + 1);
      } catch (err) {
        console.error("Error adding product API", err);
        const newProduct = { ...currentProduct, id: Date.now() };
        setProducts((prev) => [newProduct, ...prev]);
        setTotal((prev) => prev + 1);
      }
    }
    setOpenModal(false);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error("Error deleting product API", err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setTotal((prev) => prev - 1);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      description: "ID of the product",
    },
    {
      field: "title",
      headerName: "Product",
      width: 300,
      renderCell: (cellData) => {
        return (
          <Product
            productName={cellData.row.title}
            thumbnail={cellData.row.thumbnail}
          />
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      valueGetter: (params) => "$" + params.row.price,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 130,
      valueGetter: (params) => params.row.stock + " pcs",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="primary" onClick={() => handleOpenEdit(params.row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDeleteProduct(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search products..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <IconButton onClick={handleSearch} sx={{ ml: 1 }}>
            <Search />
          </IconButton>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}>
          Add Product
        </Button>
        </Box>

      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0, minHeight: 400 }}
        rows={products}
        columns={columns}
        rowCount={total}
        loading={loading}
        // loading={setLoading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        // checkboxSelection
        disableRowSelectionOnClick
      />

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="xs">
        <DialogTitle>{editMode ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              size="small"
              value={currentProduct.title}
              onChange={(e) => setCurrentProduct({ ...currentProduct, title: e.target.value })}
            />
            <TextField
              label="Category"
              fullWidth
              size="small"
              value={currentProduct.category}
              onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
            />
            <TextField
              label="Price ($)"
              type="number"
              fullWidth
              size="small"
              value={currentProduct.price}
              onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
            />
            <TextField
              label="Stock (pcs)"
              type="number"
              fullWidth
              size="small"
              value={currentProduct.stock}
              onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProduct}>
            {editMode ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
