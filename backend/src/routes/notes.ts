import { Router } from "express";
import {
  createNoteController,
  deleteNoteController,
  getNotesController,
  updateNoteController,
} from "../controllers/notesController";
import authenticateToken, {
  AuthenticatedRequest,
} from "../middlewares/authenticateToken";

const notesRouter = Router();

notesRouter
  .route("/")
  .get(authenticateToken, (req, res) => getNotesController(req, res))
  .post(authenticateToken, (req, res) => createNoteController(req, res))
  .patch(authenticateToken, (req, res) => updateNoteController(req, res))
  .delete(authenticateToken, (req, res) => deleteNoteController(req, res));

export default notesRouter;
