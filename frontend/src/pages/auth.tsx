import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IErrorResponse, ISuccessResponse } from "../models/IResponse";

import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

const Auth = () => {
  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState("signin");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async () => {
    setErrorMessage("");
    if (loginMethod == "signup") {
      if (password.length < 8) {
        setErrorMessage("Password must be atleast 8 character long");
        return;
      }
      if (password == confirmPassword) {
        authenticate("auth/signup");
      } else {
        setErrorMessage("Password don't match");
      }
    } else {
      authenticate("auth/signin");
    }
  };

  const authenticate = async (path: string) => {
    try {
      const response = await axios.post(`http://localhost:3000/${path}`, {
        email: email,
        password: password,
      });
      console.log(response.data);
      try {
        const token = (response.data as ISuccessResponse).data["token"];
        localStorage.setItem("token", token);
        console.log(token);
        navigate("/");
      } catch (err) {
        setErrorMessage("Server Error. Please try after some time");
      }
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        const response = (err as AxiosError).response?.data as IErrorResponse;

        setErrorMessage(response.message);
      }
    }
  };

  return (
    <Grid>
      <Paper
        elevation={10}
        style={{ padding: 20, width: 400, height: "70vh", margin: "40px auto" }}
      >
        <Box marginBottom={"10px"}>
          <ToggleButtonGroup
            value={loginMethod}
            fullWidth
            exclusive
            onChange={(_event, value) => {
              setErrorMessage("");
              setLoginMethod(value);
            }}
          >
            <ToggleButton value="signin">Sign In</ToggleButton>
            <ToggleButton value="signup">Sign Up</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {errorMessage != "" && (
          <Alert severity="info" onClose={() => {}}>
            {errorMessage}
          </Alert>
        )}
        <Typography
          paddingInlineStart={"10px"}
          marginTop={"20px"}
          marginBottom={"10px"}
        >
          Email:
        </Typography>
        <TextField
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        ></TextField>
        <Typography
          paddingInlineStart={"10px"}
          marginTop={"20px"}
          marginBottom={"10px"}
        >
          Password:
        </Typography>
        <TextField
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        ></TextField>
        {loginMethod == "signup" && (
          <>
            <Typography
              paddingInlineStart={"10px"}
              marginTop={"20px"}
              marginBottom={"10px"}
            >
              Confirm Password:
            </Typography>
            <TextField
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
            ></TextField>
          </>
        )}
        <Box marginTop={"20px"}>
          <Button variant="outlined" fullWidth onClick={onSubmit}>
            Submit
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default Auth;
