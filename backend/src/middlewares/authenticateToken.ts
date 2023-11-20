import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import CustomError, { Unauthorized } from "../utils/errors.utils";

// Define a custom decoded token interface
interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
}

// Define a custom request interface that includes user information
export interface AuthenticatedRequest extends Request {
  user: DecodedToken;
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw Unauthorized;
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY ?? ""
    ) as DecodedToken;

    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (err) {
    res.status(Unauthorized.statusCode).json({
      error: Unauthorized.error,
      message: Unauthorized.message,
    });
  }
}

export default authenticateToken;
