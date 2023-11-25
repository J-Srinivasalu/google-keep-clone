import { Clear } from "@mui/icons-material";
import { IconButton, Paper, Typography } from "@mui/material";
import { useState, FC } from "react";
import { INote } from "../models/INote";
import { deleteNote } from "../services/notesApiService";

interface NoteProps {
  note: INote;
  onError: (errorMessage: string) => void;
  onDelete: (id: string) => void;
  onClick: (note: INote) => void;
  navigateToAuth: () => void;
}

const Note: FC<NoteProps> = (props) => {
  const [isHovered, setIsHovered] = useState(false);

  const onDelete = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string | undefined
  ) => {
    event.stopPropagation();
    if (!id) {
      props.onError("something went wrong, please try again");
      return;
    }

    deleteNote(
      id,
      (id) => props.onDelete(id),
      (errorMessage) => props.onError(errorMessage),
      () => props.navigateToAuth()
    );
  };

  return (
    <Paper
      style={{
        position: "relative",
        padding: "20px",
        margin: "20px",
        minWidth: 150,
        maxWidth: 150,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => props.onClick(props.note)}
    >
      {isHovered && (
        <IconButton
          style={{
            position: "absolute",
            top: -15,
            right: -5,
          }}
          onClick={(e) => {
            onDelete(e, props.note.id);
          }}
        >
          <Clear color="error" />
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
