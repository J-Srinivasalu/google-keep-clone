export default class CustomError extends Error {
  statusCode: number;
  error: string;

  constructor(statusCode: number, error: string, message?: string) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const ServerError = new CustomError(
  500,
  "Server Error",
  "Server Error, Please try after sometime."
);
export const UserNotFoundError = new CustomError(
  404,
  "Not Found",
  "User not found"
);

export const UserFoundError = new CustomError(
  400,
  "Already Exist",
  "User already exist with this email."
);

export const WrongCredentials = new CustomError(
  401,
  "Unauthorized",
  "Wrong credentials"
);
export const BadRequest = new CustomError(
  400,
  "Bad Request",
  "Validation failed. Please check your input."
);
export const NoteNoteFoundError = new CustomError(
  404,
  "Not Found",
  "Note not found"
);
export const Unauthorized = new CustomError(
  401,
  "Unauthorized",
  "User not authorized"
);
