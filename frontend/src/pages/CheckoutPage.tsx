import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useCart } from "../context/Cart/CartContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRef } from "react";
import { TextField } from "@mui/material";
import { BASE_URL } from "../constants/baseUrl";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
const CheckoutPage = () => {
  const {
    cartItems,
    totalAmount,
  } = useCart();
 
const { token } = useAuth();
  const navigate = useNavigate();
  const addressRef = useRef<HTMLInputElement>(null);

  const handelConfirmOrder = async()=>{
    const address = addressRef.current?.value;
    if(!address) return;
    const response = await fetch(`${BASE_URL}/cart/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
    
            address,
          }),
        });

        if(!response.ok) return;
        navigate('/order-success');
  }

  return (
    <Container fixed sx={{ mt: 2 , display:"flex", flexDirection: "column" , gap:1}}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display='flex' flexDirection="row" justifyContent="space-between">
          <Typography variant="h4">Checkout</Typography>
          
        </Box>
        <TextField  inputRef={addressRef} label="Delivery Address" name="address" fullWidth/>
        {cartItems.map((item) => (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              border: 1,
              borderColor: "#f2f2f2",
              borderRadius: 5,
              padding: 1,
            }}
          >
            <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
              <img src={item.image} alt="" width="50" />
              <Box >
                <Typography variant="h6">{item.title}</Typography>
                <Typography>
                  {item.quantity} x {item.unitPrice} EGP
                </Typography>
              </Box>
            </Box>

          </Box>
        ))}
        <Box display="flex" flexDirection="row" justifyContent="space-between"> 
          <Typography variant="body1">Total Amount : {totalAmount} EGP</Typography>
          
        </Box>
      </Box>
      <Button variant="contained" fullWidth sx={{mt:2}} onClick={handelConfirmOrder}> Pay Now </Button>
    </Container>
  );
};

export default CheckoutPage;
