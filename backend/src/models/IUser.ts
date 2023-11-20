import { INote } from "./INote";

export interface IUser {
  id: string;
  email: string;
  password: string;
  notes: INote[];
}
