import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";
import { useCart } from "../context/Cart/CartContext";
import Box from "@mui/material/Box";

const CartPage = () => {
  const { token } = useAuth();
  const { cartItems, totalAmount} = useCart();
  const [error, setError] = useState("");
  // useEffect(() => {
  //   if (!token) {
  //     return;
  //   }
  //   const fetchCart = async () => {
  //     const response = await fetch(`${BASE_URL}/cart`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (!response.ok) {
  //       setError("failed to fetch user cart");
  //     }
  //     const data = await response.json();
  //     setCart(data);
  //   };
  //   fetchCart();
  // }, [token]);

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4">My Cart</Typography>
    {cartItems.map((item)=>
    <Box>{item.title}</Box>
    )}
    </Container>
  );
};

export default CartPage;
