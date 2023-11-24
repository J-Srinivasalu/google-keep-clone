import { useEffect, useState } from "react";
import { INote } from "../models/INote";
import { Box, Dialog, TextField, Typography } from "@mui/material";

interface AddNoteProps {
  open: boolean;
  noteToUpdate?: INote;
  onClose: (note: INote) => void;
}

const AddNoteDialog = (props: AddNoteProps) => {
  const { open, noteToUpdate, onClose } = props;
  const [title, setTitle] = useState(noteToUpdate?.title || "");
  const [description, setDescription] = useState(
    noteToUpdate?.description || ""
  );

  useEffect(() => {
    if (open) {
      setTitle(noteToUpdate?.title || "");
      setDescription(noteToUpdate?.description || "");
    }
  }, [open, noteToUpdate]);

  const handleClose = () => {
    onClose({
      id: noteToUpdate?.id,
      title: title,
      description: description,
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box
        style={{
          padding: 20,
          maxWidth: 400,
        }}
      >
        <Typography
          paddingInlineStart={"10px"}
          marginTop={"20px"}
          marginBottom={"10px"}
        >
          {noteToUpdate ? "Update Note" : "Add Note"}
        </Typography>
        <TextField
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        ></TextField>
        <TextField
          type="text"
          value={description}
          placeholder="Description"
          rows={10}
          multiline
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        ></TextField>
      </Box>
    </Dialog>
  );
};

export default AddNoteDialog;
