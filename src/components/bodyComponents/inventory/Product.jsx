import { Avatar, Typography } from "@mui/material";
import React from "react";
//more about avatar refres to https://mui.com/material-ui/react-avatar/
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
