import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import AuthInputField from "../components/AuthInputField";
import { signIn, signUp } from "../services/authApiService";

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
        signUp(
          email,
          password,
          () => navigate("/"),
          (errorMessage) => setErrorMessage(errorMessage)
        );
      } else {
        setErrorMessage("Password don't match");
      }
    } else {
      signIn(
        email,
        password,
        () => navigate("/"),
        (errorMessage) => setErrorMessage(errorMessage)
      );
    }
  };

  return (
    <Grid>
      <Paper
        elevation={10}
        style={{ padding: 20, width: 400, height: "70vh", margin: "40px auto" }}
      >
        <Typography
          paddingInlineStart={"10px"}
          textAlign={"center"}
          fontSize={25}
          color={"primary"}
          margin={"20px"}
        >
          Welcome!
        </Typography>
        <Box marginBottom={"10px"}>
          <ToggleButtonGroup
            color="primary"
            size="small"
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <AuthInputField
            type="email"
            placeholder="Email"
            onChange={(value) => setEmail(value)}
          />
          <AuthInputField
            type="password"
            placeholder="Password"
            onChange={(value) => setPassword(value)}
          />
          {loginMethod == "signup" && (
            <AuthInputField
              type="password"
              placeholder="Confirm Password"
              onChange={(value) => setConfirmPassword(value)}
            />
          )}
          <Box marginTop={"20px"}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              fullWidth
              onClick={onSubmit}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Grid>
  );
};

export default Auth;
