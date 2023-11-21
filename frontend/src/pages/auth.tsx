import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IErrorResponse, ISuccessResponse } from "../models/IResponse";

const Auth = () => {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async () => {
    console.log(email + " " + password);
    if (isSignUp) {
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
    <div>
      <div>
        <button onClick={() => setIsSignUp(false)}>Sign In</button>
        <button onClick={() => setIsSignUp(true)}>Sign Up</button>
      </div>
      <br />
      Email:
      <br />
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <br />
      Password:
      <br />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      {isSignUp && (
        <>
          <br />
          Confirm Password:
          <br />
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </>
      )}
      <br />
      {errorMessage}
      <br />
      <button onClick={onSubmit}>{isSignUp ? "Sign Up" : "Sign In"}</button>
    </div>
  );
};

export default Auth;
