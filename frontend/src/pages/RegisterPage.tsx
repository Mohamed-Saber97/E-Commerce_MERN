import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";

const RegisterPage = () => {

    const [errors, setErrors] = useState("");
  //ref
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    //call api to create the user
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers:{
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });

    if(!response.ok){
            setErrors("Unable to register the user please try again");
        return;
    }

    const data = await response.json();
console.log(data)
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
        <Typography variant="h6">Register New Account</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", mt: 4, gap: 2 }}>
          <TextField
            inputRef={firstNameRef}
            label="First Name"
            name="firstname"
          />
          <TextField inputRef={lastNameRef} label="Last Name" name="lastname" />
          <TextField inputRef={emailRef} label="Email" name="email" />
          <TextField
            inputRef={passwordRef}
            label="Password"
            name="password"
            type="password"
          />
          <Button onClick={onSubmit} variant="contained">
            Register
          </Button>
          {errors && <Typography sx={{color:"red"}}>{errors}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
