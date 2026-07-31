import { Avatar, Typography } from "@mui/material";
// import React from "react";
export default function Product({ productName, thumbnail }) {
  return (
    <>
      <Avatar
        alt={productName}
        src={thumbnail}
        sx={{ width: 30, height: 30 }}
      >
        {productName ? productName.charAt(0) : "P"}
      </Avatar>

      <Typography sx={{ mx: 3 }} variant="subtitle2">
        {productName}
      </Typography>
    </>
  );
}
