import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { INote } from "../models/INote";
import {
  Alert,
  Box,
  Button,
  Dialog,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { IErrorResponse, ISuccessResponse } from "../models/IResponse";
import Note from "../components/Note";

interface GetNotesResponse {
  message: string;
  data: {
    notes: INote[];
  };
}

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

const Home = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<INote[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<INote | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleOnClose = (note: INote) => {
    if (note.title.length != 0 || note.description.length != 0) {
      if (note.id) {
        updateNote(note);
      } else {
        saveNote(note);
      }
    }

    setOpen(false);
  };

  const saveNote = async (note: INote) => {
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
        setNotes([...notes, note]);
      } catch (err) {
        setErrorMessage("Server Error. Please try after some time");
      }
    } catch (err) {
      navigate("/auth");
      console.log(err);
      if (axios.isAxiosError(err)) {
        const response = (err as AxiosError).response?.data as IErrorResponse;

        setErrorMessage(response.message);
      }
    }
  };

  const updateNote = async (note: INote) => {
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

    setNotes((prevNotes) => {
      const noteIndex = prevNotes.findIndex((n) => n.id === note.id);
      if (noteIndex != -1) {
        prevNotes[noteIndex].title = note.title;
        prevNotes[noteIndex].description = note.description;
      }
      return prevNotes;
    });

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
        console.log(res);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    console.log(token);
    getNotes(token);
  }, []);

  const getNotes = async (token: string) => {
    const authToken = `Bearer ${token}`;
    try {
      const response = await axios.get("http://localhost:3000/notes", {
        headers: {
          Authorization: authToken,
        },
      });

      const notes: INote[] = (response.data as GetNotesResponse).data.notes;

      setNotes(notes);
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        const response = (err as AxiosError).response;
        if (response?.status == 401) {
          navigate("/auth");
        }
        const errorResponse = response?.data as IErrorResponse;
        setErrorMessage(errorResponse.message);
      }
    }
  };

  const openUpdateDialog = (note: INote) => {
    setSelectedNote(note);
    setOpen(true);
  };

  const openAddDialog = () => {
    setSelectedNote(undefined);
    setOpen(true);
  };

  const deleteNote = async (id: string) => {
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

  const signout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <>
      <Paper style={{ margin: "10px", padding: "10px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4">Notes</Typography>
          <Button variant="outlined" onClick={signout}>
            Sign Out
          </Button>
        </Box>
      </Paper>
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
      <Paper style={{ margin: "10px" }}>
        <TextField
          placeholder="Add Note"
          onClick={() => {
            console.log("clicked");
            openAddDialog();
          }}
          fullWidth
        ></TextField>
      </Paper>
      <Paper style={{ margin: "10px", padding: "10px" }}>
        <Grid container spacing={2} wrap="wrap">
          {notes.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center" variant="h6">
                No notes
              </Typography>
            </Grid>
          ) : (
            notes.map((note) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
                <Note
                  note={note}
                  onClick={(note) => openUpdateDialog(note)}
                  onDelete={(id) => deleteNote(id)}
                  onError={(error) => setErrorMessage(error)}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Paper>
      <AddNoteDialog
        open={open}
        onClose={(note) => handleOnClose(note)}
        noteToUpdate={selectedNote}
      />
    </>
  );
};

export default Home;
