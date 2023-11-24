import axios, { AxiosError } from "axios";
import { INote } from "../models/INote";
import { IErrorResponse, ISuccessResponse } from "../models/IResponse";

interface GetNotesResponse {
  message: string;
  data: {
    notes: INote[];
  };
}

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

export async function getNotes(
  onSuccess: (notes: INote[]) => void,
  onError: (errorMessage: string) => void,
  navigateToAuth: () => void
) {
  const token = localStorage.getItem("token");
  if (!token) {
    onError("User not authorized");
    return;
  }
  const authToken = `Bearer ${token}`;
  try {
    const response = await axios.get("http://localhost:3000/notes", {
      headers: {
        Authorization: authToken,
      },
    });

    const notes: INote[] = (response.data as GetNotesResponse).data.notes;
    onSuccess(notes);
  } catch (err) {
    handleAxiosError(err, navigateToAuth, onError);
  }
}

export async function saveNote(
  note: INote,
  onSuccess: (note: INote) => void,
  onError: (errorMessage: string) => void,
  navigateToAuth: () => void
) {
  try {
    const response = await axios.post(
      `http://localhost:3000/notes`,
      {
        title: note.title,
        description: note.description,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    console.log(response.data);
    try {
      const id = (response.data as ISuccessResponse).data["id"];
      note.id = id;
      onSuccess(note);
    } catch (err) {
      onError("Server Error. Please try after some time");
    }
  } catch (err) {
    handleAxiosError(err, navigateToAuth, onError);
  }
}

export async function updateNote(
  note: INote,
  onSuccess: (note: INote) => void,
  onError: (errorMessage: string) => void,
  navigateToAuth: () => void
) {
  try {
    const response = await axios.patch(
      `http://localhost:3000/notes`,
      {
        id: note.id,
        title: note.title,
        description: note.description,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    console.log(response.data);
    try {
      const res = response.data as ISuccessResponse;
      onSuccess(note);
      console.log(res);
    } catch (err) {
      onError("Server Error. Please try after some time");
    }
  } catch (err) {
    handleAxiosError(err, navigateToAuth, onError);
  }
}

export async function deleteNote(
  id: string,
  onSuccess: (id: string) => void,
  onError: (errorMessage: string) => void,
  navigateToAuth: () => void
) {
  try {
    const response = await axios.delete(
      `http://localhost:3000/notes?noteId=${id}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    console.log(response.data);
    try {
      console.log("done delete");
      onSuccess(id);
    } catch (err) {
      onError("Server Error. Please try after some time");
    }
  } catch (err) {
    handleAxiosError(err, navigateToAuth, onError);
  }
}
