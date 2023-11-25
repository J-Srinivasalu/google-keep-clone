import axios, { AxiosError } from "axios";
import { IErrorResponse } from "../models/IResponse";

const handleAxiosError = (
  err: unknown,
  navigateToAuth: () => void,
  onError: (errorMessage: string) => void
) => {
  console.log(err);
  if (axios.isAxiosError(err)) {
    const axiosError = err as AxiosError;
    if (axiosError.code == "ERR_NETWORK") {
      onError("Server down, Please try after sometime");
    }
    const response = axiosError.response;
    if (response?.status == 401) {
      navigateToAuth();
    }
    const errorResponse = response?.data as IErrorResponse;
    onError(errorResponse.message);
  }
};

export default handleAxiosError;
