import { INote } from "../models/INote";
import { ISuccessResponse } from "../models/IResponse";
import config from "../config/config";
import handleAxiosError from "./axiosErrorHelper";
import axios from "axios";

const baseUrl = config.baseUrl;

interface GetNotesResponse {
  message: string;
  data: {
    notes: INote[];
  };
}

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
    const response = await axios.get(`${baseUrl}/notes`, {
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
      `${baseUrl}/notes`,
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
      `${baseUrl}/notes`,
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
    const response = await axios.delete(`${baseUrl}/notes?noteId=${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
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
