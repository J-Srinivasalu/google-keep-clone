import mongoose, { Document } from "mongoose";
import { INote } from "./INote";

import bcrypt from "bcrypt";

const saltRounds = 8;

export interface IUserDocument extends Document {
  id: string;
  email: string;
  password: string;
  notes: INote[];
}

const NoteSchema: mongoose.Schema<INote> = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
});

const UserSchema: mongoose.Schema<IUserDocument> = new mongoose.Schema({
  id: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  notes: { type: [NoteSchema] },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  next();
});

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
