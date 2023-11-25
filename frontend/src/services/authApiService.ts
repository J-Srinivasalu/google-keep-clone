import axios from "axios";
import config from "../config/config";
import { ISuccessResponse } from "../models/IResponse";
import handleAxiosError from "./axiosErrorHelper";

const baseUrl = config.baseUrl;

export async function signIn(
  email: string,
  password: string,
  onSuccess: () => void,
  onError: (errorMessage: string) => void
) {
  authenticate(email, password, "signin", onSuccess, onError);
}

export async function signUp(
  email: string,
  password: string,
  onSuccess: () => void,
  onError: (errorMessage: string) => void
) {
  authenticate(email, password, "signup", onSuccess, onError);
}

async function authenticate(
  email: string,
  password: string,
  path: string,
  onSuccess: () => void,
  onError: (errorMessage: string) => void
) {
  try {
    const response = await axios.post(`${baseUrl}/auth/${path}`, {
      email: email,
      password: password,
    });
    console.log(response.data);
    try {
      const token = (response.data as ISuccessResponse).data["token"];
      localStorage.setItem("token", token);
      console.log(token);
      onSuccess();
    } catch (err) {
      onError("Server Error. Please try after some time");
    }
  } catch (err) {
    console.log(err);
    handleAxiosError(
      err,
      () => {
        onError("Something went wrong, Please try after sometime.");
      },
      onError
    );
  }
}
