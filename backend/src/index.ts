import express from "express";
import authRouter from "./routes/auth";
import notesRouter from "./routes/notes";
import mongoose from "mongoose";
import config from "./config/config";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Everything works!",
  });
});

app.use("/auth", authRouter);
app.use("/notes", notesRouter);

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log(`Running on ENV = ${process.env.NODE_ENV}`);
    console.log("Connected to mongoDB.");
    app.listen(PORT, () => {
      console.log(`Server started on port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Unable to connect.");
    console.log(error);
  });
