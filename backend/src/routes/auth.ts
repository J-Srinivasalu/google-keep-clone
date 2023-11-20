import { Router, Request, Response } from "express";
import { users } from "../utils/dummyData";
import {
  signinController,
  signupController,
} from "../controllers/authController";

const authRouter = Router();

authRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "all user for dev purpose",
    data: {
      users: users,
    },
  });
});

authRouter.post("/signup", (req: Request, res: Response) => {
  signupController(req, res);
});

authRouter.post("/signin", (req: Request, res: Response) => {
  signinController(req, res);
});

export default authRouter;
