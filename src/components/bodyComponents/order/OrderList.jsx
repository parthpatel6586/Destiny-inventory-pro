import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Modal, Typography, IconButton, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Visibility } from "@mui/icons-material";
import OrderModal from "./OrderModal";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [paginationModel]);

  const fetchOrders = async () => {
    setLoading(true);
    const { page, pageSize } = paginationModel;
    const skip = page * pageSize;
    try {
      const res = await fetch(`https://dummyjson.com/carts?limit=${pageSize}&skip=${skip}`);
      const data = await res.json();
      setOrders(data.carts || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
    setLoading(false);
  };

  const handleOrderDetail = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (id) => {
    try {
      await fetch(`https://dummyjson.com/carts/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting order", err);
    }
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setTotal((prev) => prev - 1);
  };

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      width: 100,
    },
    {
      field: "userId",
      headerName: "User / Customer ID",
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: "secondary.main" }}>
            U
          </Avatar>
          <Typography variant="subtitle2">User #{params.row.userId}</Typography>
        </Box>
      ),
    },
    {
      field: "totalProducts",
      headerName: "Total Products",
      width: 140,
    },
    {
      field: "totalQuantity",
      headerName: "Total Items",
      width: 130,
    },
    {
      field: "total",
      headerName: "Total Amount",
      width: 150,
      valueGetter: (params) => `$${params.row.total ? params.row.total.toFixed(2) : "0.00"}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<Visibility />}
            onClick={() => handleOrderDetail(params.row)}
          >
            Details
          </Button>
          <IconButton size="small" color="error" onClick={() => handleDeleteOrder(params.row.id)}>
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
      <Typography variant="h5" fontWeight="bold">
        Orders
      </Typography>

      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0, minHeight: 400 }}
        rows={orders}
        columns={columns}
        rowCount={total}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box>
          <OrderModal order={selectedOrder} onClose={handleCloseModal} />
        </Box>
      </Modal>
    </Box>
  );
}
