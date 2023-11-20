import { INote } from "../models/INote";
import { IUserDocument, UserModel } from "../models/user";
import {
  NoteNoteFoundError,
  ServerError,
  UserNotFoundError,
} from "../utils/errors.utils";

export async function getNotesByUserId(
  userId: string,
  noteId?: string
): Promise<INote[]> {
  try {
    const user = await getUser(userId);

    const notes: INote[] = [];

    if (!noteId) {
      notes.push(...user.notes);
    } else {
      const note: INote | undefined = user.notes.find((n) => n.id == noteId);
      if (!note) {
        throw NoteNoteFoundError;
      }
      notes.push(note);
    }

    return notes;
  } catch (error) {
    throw ServerError;
  }
}

export async function addNoteToUser(
  userId: string,
  title: string,
  description: string
): Promise<string | null> {
  try {
    const user = await getUser(userId);

    const noteId = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(12, "0");

    const newNote = {
      id: noteId,
      title,
      description,
    };

    user.notes.push(newNote);

    await user.save();

    return noteId;
  } catch (error) {
    throw ServerError;
  }
}

export async function updateNoteByUserId(
  userId: string,
  noteId: string,
  title: string,
  description: string
): Promise<INote> {
  try {
    const user = await getUser(userId);
    const noteIndex = user.notes.findIndex((n) => n.id == noteId);

    if (noteIndex == -1) {
      throw NoteNoteFoundError;
    }

    user.notes[noteIndex].title = title;
    user.notes[noteIndex].description = description;

    await user.save();

    return user.notes[noteIndex];
  } catch (error) {
    throw ServerError;
  }
}

export async function deleteNoteByUserId(
  userId: string,
  noteId: string
): Promise<INote> {
  try {
    const user = await getUser(userId);
    const noteIndex = user.notes.findIndex((n) => n.id == noteId);

    if (noteIndex == -1) {
      throw NoteNoteFoundError;
    }

    const note = user.notes.splice(noteIndex, 1);

    await user.save();

    return note[0];
  } catch (error) {
    throw ServerError;
  }
}

async function getUser(userId: string): Promise<IUserDocument> {
  const user = await UserModel.findOne({ id: userId });

  if (!user) {
    throw UserNotFoundError;
  }
  return user;
}
