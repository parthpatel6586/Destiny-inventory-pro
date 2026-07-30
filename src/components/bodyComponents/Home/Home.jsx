import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";

import UilReceipt from "@iconscout/react-unicons/icons/uil-receipt";
import UilBox from "@iconscout/react-unicons/icons/uil-box";
import UilTruck from "@iconscout/react-unicons/icons/uil-truck";
import UilCheckCircle from "@iconscout/react-unicons/icons/uil-check-circle";
import InfoCard from "../../subComponents/InfoCard";
import TotalSales from "./TotalSales";
import SalesByCity from "./SalesByCity";
import Channels from "./Channels";
import TopSellingProduct from "./TopSellingProduct";

export default function Home() {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("https://dummyjson.com/products?limit=1").then((r) => r.json()),
      fetch("https://dummyjson.com/users?limit=1").then((r) => r.json()),
      fetch("https://dummyjson.com/carts?limit=1").then((r) => r.json()),
    ])
      .then(([prodRes, userRes, cartRes]) => {
        setStats({
          products: prodRes.total || 0,
          customers: userRes.total || 0,
          orders: cartRes.total || 0,
        });
      })
      .catch((err) => console.error("Error fetching stats", err));
  }, []);

  const cardComponent = [
    {
      icon: <UilBox size={60} color={"#F6F4EB"} />,
      title: "Total Products",
      subTitle: stats.products.toString(),
      mx: 3,
      my: 0,
    },
    {
      icon: <UilTruck size={60} color={"#F6F4EB"} />,
      title: "Total Orders",
      subTitle: stats.orders.toString(),
      mx: 5,
      my: 0,
    },
    {
      icon: <UilCheckCircle size={60} color={"#F6F4EB"} />,
      title: "Total Customers",
      subTitle: stats.customers.toString(),
      mx: 5,
      my: 0,
    },
    {
      icon: <UilReceipt size={60} color={"#F6F4EB"} />,
      title: "System Status",
      subTitle: "Live API",
      mx: 3,
      my: 0,
    },
  ];

  return (
    <Box sx={{ margin: 0, padding: 3 }}>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginX: 3,
          borderRadius: 2,
          padding: 0,
        }}
      >
        {cardComponent.map((card, index) => (
          <Grid item md={3} key={index}>
            <InfoCard card={card} />
          </Grid>
        ))}
      </Grid>

      <Grid container sx={{ marginX: 3 }}>
        <Grid item md={8}>
          <TotalSales data={{}} />
        </Grid>
        <Grid item md={4}>
          <SalesByCity data={{}} />
        </Grid>
      </Grid>

      <Grid container sx={{ margin: 3 }}>
        <Grid item md={6}>
          <Channels />
        </Grid>
        <Grid item md={6}>
          <TopSellingProduct />
        </Grid>
      </Grid>
    </Box>
  );
}
