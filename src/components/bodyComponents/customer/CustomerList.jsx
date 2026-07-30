import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search, Add, Edit, Delete } from "@mui/icons-material";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Dialog State
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, [paginationModel, searchQuery]);

  const fetchCustomers = async () => {
    setLoading(true);
    const { page, pageSize } = paginationModel;
    const skip = page * pageSize;
    let url = `https://dummyjson.com/users?limit=${pageSize}&skip=${skip}`;

    if (searchQuery) {
      url = `https://dummyjson.com/users/search?q=${searchQuery}&limit=${pageSize}&skip=${skip}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setCustomers(data.users || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setSearchQuery(inputValue);
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentCustomer({ id: null, firstName: "", lastName: "", email: "", phone: "" });
    setOpenModal(true);
  };

  const handleOpenEdit = (customerRow) => {
    setEditMode(true);
    setCurrentCustomer(customerRow);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSaveCustomer = async () => {
    if (editMode) {
      try {
        await fetch(`https://dummyjson.com/users/${currentCustomer.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentCustomer),
        });
      } catch (err) {
        console.error("Error updating customer", err);
      }
      setCustomers((prev) =>
        prev.map((c) => (c.id === currentCustomer.id ? { ...c, ...currentCustomer } : c))
      );
    } else {
      try {
        const res = await fetch("https://dummyjson.com/users/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentCustomer),
        });
        const created = await res.json();
        setCustomers((prev) => [created, ...prev]);
        setTotal((prev) => prev + 1);
      } catch (err) {
        console.error("Error adding customer", err);
        const newCust = { ...currentCustomer, id: Date.now() };
        setCustomers((prev) => [newCust, ...prev]);
        setTotal((prev) => prev + 1);
      }
    }
    setOpenModal(false);
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await fetch(`https://dummyjson.com/users/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting customer", err);
    }
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setTotal((prev) => prev - 1);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "fullname",
      headerName: "Full Name",
      width: 230,
      renderCell: (params) => {
        const fullName = `${params.row.firstName || ""} ${params.row.lastName || ""}`;
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              alt={fullName}
              src={params.row.image}
              sx={{ width: 32, height: 32, mr: 2 }}
            >
              {fullName ? fullName.charAt(0) : "C"}
            </Avatar>
            <Typography variant="subtitle2">{fullName}</Typography>
          </Box>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
    },
    {
      field: "phone",
      headerName: "Mobile / Phone",
      width: 180,
    },
    {
      field: "age",
      headerName: "Age",
      width: 90,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 110,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="primary" onClick={() => handleOpenEdit(params.row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDeleteCustomer(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" fontWeight="bold">
          Customers
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search customers..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <IconButton onClick={handleSearch}>
            <Search />
          </IconButton>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd} sx={{ ml: 1 }}>
            Add Customer
          </Button>
        </Box>
      </Box>

      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0, minHeight: 400 }}
        rows={customers}
        columns={columns}
        rowCount={total}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="xs">
        <DialogTitle>{editMode ? "Edit Customer" : "Add New Customer"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="First Name"
              fullWidth
              size="small"
              value={currentCustomer.firstName}
              onChange={(e) => setCurrentCustomer({ ...currentCustomer, firstName: e.target.value })}
            />
            <TextField
              label="Last Name"
              fullWidth
              size="small"
              value={currentCustomer.lastName}
              onChange={(e) => setCurrentCustomer({ ...currentCustomer, lastName: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              size="small"
              value={currentCustomer.email}
              onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
            />
            <TextField
              label="Phone"
              fullWidth
              size="small"
              value={currentCustomer.phone}
              onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCustomer}>
            {editMode ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
