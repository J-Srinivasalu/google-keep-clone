import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";
import { INote } from "../models/INote";

interface GetNotesResponse {
  message: string;
  data: {
    notes: INote[];
  };
}

const Home = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<INote[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    console.log(token);
    getNotes(token);
  }, [navigate]);

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
    } catch (error) {
      console.log(error);
    }
  };

  const signout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <>
      <h1>Home</h1>
      <br />
      <br />
      <h3>Notes</h3>
      <br />
      {notes.map((note) => (
        <div
          className="card"
          style={{
            backgroundColor: "white",
            color: "black",
            margin: "24px",
          }}
          key={note.id}
        >
          <p>{note.title}</p>
          <hr />
          <p>{note.description}</p>
        </div>
      ))}
      <br />
      <button onClick={signout}>signout</button>
    </>
  );
};

export default Home;
