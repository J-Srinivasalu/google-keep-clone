require("dotenv").config();
import { Request, Response } from "express";
import { z } from "zod";
import { INote } from "../models/INote";
import { IUser } from "../models/IUser";
import CustomError, { BadRequest, ServerError } from "../utils/errors.utils";
import {
  addNoteToUser,
  deleteNoteByUserId,
  getNotesByUserId,
  updateNoteByUserId,
} from "../services/notesService";
import { AuthenticatedRequest } from "../middlewares/authenticateToken";

const noteInput = z.object({
  title: z.string(),
  description: z.string(),
});

const updateNoteInput = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

export async function createNoteController(req: Request, res: Response) {
  try {
    const userId: string = (req as AuthenticatedRequest).user.id;
    const newNote: INote = req.body;

    const parsedNote = noteInput.safeParse(newNote);

    if (!parsedNote.success) {
      throw BadRequest;
    }

    const noteId: string | null = await addNoteToUser(
      userId,
      newNote.title,
      newNote.description
    );

    if (!noteId) {
      throw ServerError;
    }

    res.status(201).json({
      message: "note saved successfully",
      data: {
        id: noteId,
      },
    });
  } catch (err) {
    const error = err as CustomError;
    res.status(error.statusCode).json({
      error: error.error,
      message: error.message,
    });
  }
}

export async function getNotesController(req: Request, res: Response) {
  try {
    const userId: string = (req as AuthenticatedRequest).user.id;
    const noteId = req.query.noteId as string | undefined;

    const notes: INote[] = await getNotesByUserId(userId, noteId);

    res.status(200).json({
      message: "notes fetched successfully",
      data: {
        notes: notes,
      },
    });
  } catch (err) {
    const error = err as CustomError;
    res.status(error.statusCode).json({
      error: error.error,
      message: error.message,
    });
  }
}

export async function updateNoteController(req: Request, res: Response) {
  try {
    const userId: string = (req as AuthenticatedRequest).user.id;
    const note: INote = req.body;

    const parsedNote = updateNoteInput.safeParse(note);

    if (!parsedNote.success) {
      throw BadRequest;
    }

    const notes: INote = await updateNoteByUserId(
      userId,
      note.id,
      note.title,
      note.description
    );

    res.status(200).json({
      message: "notes updated successfully",
      data: {
        notes: notes,
      },
    });
  } catch (err) {
    const error = err as CustomError;
    res.status(error.statusCode).json({
      error: error.error,
      message: error.message,
    });
  }
}

export async function deleteNoteController(req: Request, res: Response) {
  try {
    const userId: string = (req as AuthenticatedRequest).user.id;
    const noteId = req.query.noteId as string;

    const note: INote = await deleteNoteByUserId(userId, noteId);

    res.status(200).json({
      message: "notes deleted successfully",
      data: {
        notes: note,
      },
    });
  } catch (err) {
    const error = err as CustomError;
    res.status(error.statusCode).json({
      error: error.error,
      message: error.message,
    });
  }
}
