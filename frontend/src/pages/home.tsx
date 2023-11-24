import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { INote } from "../models/INote";
import { Alert, Box, Paper, TextField, Typography } from "@mui/material";
import Note from "../components/Note";
import { getNotes, saveNote, updateNote } from "../services/notesApiService";
import AddNoteDialog from "../components/AddNoteDialog";
import TopAppBar from "../components/TopAppBar";
import Masonry from "@mui/lab/Masonry";

const Home = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<INote[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<INote | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleNavigateToAuth();
      return;
    }
    console.log(token);
    getNotes(
      (notes) => setNotes(notes),
      (errorMessage) => setErrorMessage(errorMessage),
      () => handleNavigateToAuth()
    );
  }, []);

  const handleNavigateToAuth = () => {
    navigate("auth");
  };

  const openDialog = (note?: INote) => {
    setSelectedNote(note);
    setOpen(true);
  };

  const handleOnDialogClose = (note: INote) => {
    if (note.title.length != 0 || note.description.length != 0) {
      if (note.id) {
        handleOnUpdateNote(note);
      } else {
        saveNote(
          note,
          (newNote) => setNotes([...notes, newNote]),
          (errorMessage) => setErrorMessage(errorMessage),
          () => handleNavigateToAuth()
        );
      }
    }
    setOpen(false);
  };

  const handleOnUpdateNote = async (note: INote) => {
    if (!note.id) {
      return;
    }
    const existingNote = notes.find((n) => n.id == note.id);
    if (
      existingNote &&
      existingNote.title === note.title &&
      existingNote.description === note.description
    ) {
      return;
    }

    updateNote(
      note,
      (updatedNote) => updateGivenNote(updatedNote),
      (errorMessage) => setErrorMessage(errorMessage),
      () => handleNavigateToAuth()
    );
  };

  const updateGivenNote = (note: INote) => {
    setNotes((prevNotes) => {
      const noteIndex = prevNotes.findIndex((n) => n.id === note.id);
      if (noteIndex != -1) {
        prevNotes[noteIndex].title = note.title;
        prevNotes[noteIndex].description = note.description;
      }
      return prevNotes;
    });
  };

  const handleOnDeleteNote = async (id: string) => {
    setNotes((prevNotes) => {
      const noteIndex = prevNotes.findIndex((n) => n.id === id);
      const updateNotes = [];
      if (noteIndex != -1) {
        prevNotes.splice(noteIndex, 1);
        updateNotes.push(...prevNotes);
      }
      return updateNotes;
    });
  };

  return (
    <>
      <TopAppBar />
      <Box height={"60px"} />
      {errorMessage != "" && (
        <Alert
          severity="info"
          onClose={() => {
            setErrorMessage("");
          }}
        >
          {errorMessage}
        </Alert>
      )}
      <Paper
        style={{
          margin: "10px auto",
          width: "70vw",
        }}
      >
        <TextField
          placeholder="Add Note"
          onClick={() => {
            console.log("clicked");
            openDialog();
          }}
          fullWidth
        ></TextField>
      </Paper>
      <Box margin={"20px auto"} width={"90vw"}>
        <Masonry columns={5} spacing={2}>
          {notes.length === 0 ? (
            <Typography align="center" variant="h6">
              No notes
            </Typography>
          ) : (
            notes.map((note) => (
              <Note
                key={note.id}
                note={note}
                onClick={(note) => openDialog(note)}
                onDelete={(id) => handleOnDeleteNote(id)}
                onError={(error) => setErrorMessage(error)}
                navigateToAuth={handleNavigateToAuth}
              />
            ))
          )}
        </Masonry>
      </Box>
      <AddNoteDialog
        open={open}
        onClose={(note) => handleOnDialogClose(note)}
        noteToUpdate={selectedNote}
      />
    </>
  );
};

export default Home;
