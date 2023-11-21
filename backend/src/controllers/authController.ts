require("dotenv").config();
import { Request, Response } from "express";
import { z } from "zod";
import { IUser } from "../models/IUser";
import jwt from "jsonwebtoken";
import { createUser, loginUser } from "../services/userService";
import CustomError, { BadRequest } from "../utils/errors.utils";

const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export async function signupController(req: Request, res: Response) {
  try {
    const newUser: IUser = req.body;

    const parsedUser = signupInput.safeParse(newUser);
    if (!parsedUser.success) {
      throw BadRequest;
    }

    //save user to db and return token
    newUser.id = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(12, "0");
    newUser.notes = [];

    await createUser(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.SECRET_KEY ?? "",
      {
        expiresIn: "12h",
      }
    );

    res.status(201).json({
      message: "user created successfully",
      data: {
        token: token,
        id: newUser.id,
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

export async function signinController(req: Request, res: Response) {
  try {
    const requestedUser: IUser = req.body;

    //find user
    const user = await loginUser(requestedUser);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY ?? "",
      {
        expiresIn: "12h",
      }
    );

    res.status(200).json({
      message: "User signed in successfully",
      data: {
        id: user.id,
        token: token,
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
