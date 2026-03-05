import { CheckCircleOutline } from "@mui/icons-material";
import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrederSuccessPage = () => {
    const navigate = useNavigate();
    const handelhome = ()=>{
        navigate('/');
    }
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
      <CheckCircleOutline sx={{ color: "green", fontSize:"80px" }} />
      <Typography>Thank You for your order</Typography>
      <Button variant="contained" onClick={handelhome}>Go To Home</Button>
    </Container>
  );
};

export default OrederSuccessPage;
