import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useCart } from "../context/Cart/CartContext";
import Box from "@mui/material/Box";
import  ButtonGroup  from "@mui/material/ButtonGroup";
import  Button  from "@mui/material/Button";
const CartPage = () => {
  const { cartItems, totalAmount } = useCart();

  return (
    <Container fixed sx={{ mt: 2 }}>
      <Box display='flex' flexDirection='column' gap={4}>
      <Typography variant="h4">My Cart</Typography>
      {cartItems.map((item) => (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            border:1,
            borderColor: '#f2f2f2',
            borderRadius: 5,
            padding: 1
          }}
        >
          <Box display='flex' flexDirection='row' alignItems='center' gap={1}>
          <img src={item.image} alt="" width="50"/>
          <Box>
          
          <Typography variant="h6">{item.title}</Typography>
          <Typography>{item.quantity} x {item.unitPrice} EGP</Typography>
          </Box>
          </Box>
          <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button>-</Button>
          <Button>+</Button>
          <Button>Remove Item</Button>
          </ButtonGroup>
        </Box>
      ))}
      <Box>
        <Typography variant="h4"> Total Amount : {totalAmount} EGP</Typography>
      </Box>
      </Box>
    </Container>
  );
};

export default CartPage;
