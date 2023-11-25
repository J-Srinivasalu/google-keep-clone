import { IUser } from "../models/IUser";
import { UserModel } from "../models/user";
import {
  ServerError,
  UserFoundError,
  UserNotFoundError,
  WrongCredentials,
} from "../utils/errors.utils";
import bcrypt from "bcrypt";
export async function createUser(user: IUser) {
  const foundUser = await UserModel.findOne({ email: user.email });
  if (foundUser) {
    throw UserFoundError;
  }

  await UserModel.create(
    new UserModel({
      id: user.id,
      email: user.email,
      password: user.password,
      notes: user.notes,
    })
  );
}

export async function loginUser(user: IUser) {
  const foundUser = await UserModel.findOne({ email: user.email });

  if (!foundUser) {
    throw UserNotFoundError;
  }

  const isMatch = bcrypt.compareSync(user.password, foundUser.password);

  if (isMatch) {
    return foundUser;
  } else {
    throw WrongCredentials;
  }
}

export async function getUser(id: string) {
  const user = await UserModel.findOne({ id: id });

  if (!user) {
    throw UserNotFoundError;
  }

  return {
    id: user.id,
    email: user.email,
    password: user.password,
    notes: user.notes,
  };
}
