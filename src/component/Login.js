import React, { useState } from "react";
import { Box, Heading, TextField, Text, Button } from "gestalt";
import { observer } from "mobx-react-lite";
import useStores from "../store/Common";
import "gestalt/dist/gestalt.css";

const Login = observer(() => {
  const { auth } = useStores();
  const [email, setEmail] = useState();
  const [passowrd, setPassword] = useState();

  const handleEmailChange = event => {
    setEmail(event.value);
  };
  const handlePasswordChange = event => {
    setPassword(event.value);
  };
  const handleButtonClick = event => {
    auth.loginWith(email, passowrd);
  };

  return (
    <Box
      display="flex"
      direction="column"
      justifyContent="center"
      alignItems="center"
      margin="auto"
      padding={10}
    >
      <Heading size="sm">Login </Heading>
      <Box marginTop={5} width={300}>
        <Text>Email</Text>
        <TextField
          id="email"
          placeholder="Email Address"
          onChange={handleEmailChange}
          type="email"
        />
      </Box>
      <Box marginTop={5} width={300}>
        <Text>Password</Text>
        <TextField
          id="password"
          placeholder="Password"
          onChange={handlePasswordChange}
          type="password"
        />
      </Box>
      <Box marginTop={10} width={300}>
        <Button text="LogIn" onClick={handleButtonClick} />
      </Box>
    </Box>
  );
});

export default Login;
