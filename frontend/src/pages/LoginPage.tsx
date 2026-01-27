import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [errors, setErrors] = useState("");
  //ref

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  //const auth = useAuth();
  const { login } = useAuth();
  const onSubmit = async () => {
   
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if( !email || !password ){
      setErrors("Check Data");

      return;
    }
    //call api to create the user
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({

        email,
        password,
      }),
    });

    if (!response.ok) {
      setErrors("Unable to Login the user please try again");
      return;
    }

    const token = await response.json();

    if (!token) {
      setErrors("incorrect token");
      return;
    }
    login(email, token);
    navigate('/');
    
  };
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h6"> Login </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", mt: 4, gap: 2 }}>
          
          <TextField inputRef={emailRef} label="Email" name="email" />
          <TextField
            inputRef={passwordRef}
            label="Password"
            name="password"
            type="password"
          />
          <Button onClick={onSubmit} variant="contained">
            Login
          </Button>
          {errors && <Typography sx={{ color: "red" }}>{errors}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
