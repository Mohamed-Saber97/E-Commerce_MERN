import { CheckCircleOutline } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { useAuth } from "../context/Auth/AuthContext";
import { useEffect } from "react";

const MyOrdersPage = () => {
  const { getMyOrders, myOrders } = useAuth();
  useEffect(() => {
    getMyOrders();
  }, []);

  console.log(myOrders);
  return (
    <Container
      fixed
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
        <Typography variant="h4">My Orders</Typography>
      {myOrders.map(({  address, orderItems, total }) => (
        <Box sx={{border: 1, borderColor:"gray", borderRadius: 2, padding: 2}}>
          <Typography>Address: {address}</Typography>
          <Typography>Items: {orderItems.length}</Typography>
          <Typography>Total: {total}</Typography>
        </Box>
      ))}
    </Container>
  );
};

export default MyOrdersPage;