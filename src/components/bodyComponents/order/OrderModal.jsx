import { Delete, DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export default function OrderModal({ order, onClose }) {
  if (!order || !order.products) return null;

  const handleDeleteProductFromOrder = (orderId, productId) => {
    console.log("Delete product", productId, "from order", orderId);
  };

  const tableRows = order.products.map((orderProduct, index) => {
    const name = orderProduct.title || (orderProduct.product && orderProduct.product.name) || "Product";
    const qty = orderProduct.quantity || 1;
    const price = orderProduct.price ? `$${orderProduct.price}` : "N/A";

    return (
      <TableRow key={index}>
        <TableCell>{name}</TableCell>
        <TableCell>{qty}</TableCell>
        <TableCell>{price}</TableCell>
        <TableCell>
          <IconButton
            onClick={() =>
              handleDeleteProductFromOrder(order.id, orderProduct.id || (orderProduct.product && orderProduct.product.id))
            }
          >
            <DeleteOutline color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", md: "50%" },
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}
    >
      <Box sx={{ color: "black", display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Order Details - #{order.id}
        </Typography>

        <Paper elevation={0} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="medium">User / Customer ID:</Typography>
          <Typography variant="subtitle1" color="grey">{order.userId || "N/A"}</Typography>
        </Paper>

        <Paper elevation={0} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="medium">Total Items:</Typography>
          <Typography variant="subtitle1" color="grey">{order.totalQuantity || order.products.length}</Typography>
        </Paper>

        <Paper elevation={0} sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium">Total Amount:</Typography>
          <Typography variant="subtitle1" color="primary" fontWeight="bold">
            ${order.total ? order.total.toFixed(2) : "0.00"}
          </Typography>
        </Paper>

        <Box>
          <TableContainer sx={{ marginBottom: 3, maxHeight: 300 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{tableRows}</TableBody>
            </Table>
          </TableContainer>

          <Paper elevation={0} sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button variant="outlined" color="error" onClick={onClose} sx={{ px: 4 }}>
              Close
            </Button>
            <Button variant="contained" color="primary" onClick={onClose} sx={{ px: 4 }}>
              Approve Order
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
