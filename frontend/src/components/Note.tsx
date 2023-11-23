import { Clear } from "@mui/icons-material";
import { IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { FC } from "react";
import { INote } from "../models/INote";
import axios, { AxiosError } from "axios";
import { IErrorResponse } from "../models/IResponse";

interface NoteProps {
  note: INote;
  onError: (errorMessage: string) => void;
  onDelete: (id: string) => void;
  onClick: (note: INote) => void;
}

const Note: FC<NoteProps> = (props) => {
  const [isHovered, setIsHovered] = useState(false);

  const deleteNote = async (id: string | undefined) => {
    if (!id) {
      props.onError("something went wrong, please try again");
      return;
    }
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
        props.onDelete(id);
      } catch (err) {
        props.onError("Server Error. Please try after some time");
      }
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        const response = (err as AxiosError).response?.data as IErrorResponse;

        props.onError(response.message);
      }
    }
  };

  return (
    <Paper
      style={{
        position: "relative",
        padding: "20px",
        margin: "20px",
        minWidth: 200,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => props.onClick(props.note)}
    >
      {isHovered && (
        <IconButton
          style={{
            position: "absolute",
            top: 5,
            right: 5,
          }}
          onClick={() => {
            deleteNote(props.note.id);
          }}
        >
          <Clear />
        </IconButton>
      )}
      <Typography noWrap marginBottom="10px">
        {props.note.title}
      </Typography>
      <hr />
      <Typography>{props.note.description}</Typography>
    </Paper>
  );
};

export default Note;
