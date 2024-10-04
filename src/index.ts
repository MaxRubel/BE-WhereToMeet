// app.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/users";
import groupRouter from "./routes/groups";
import eventRouter from "./routes/events";

const cors = require("cors");

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/users", userRouter);
app.use("/events", eventRouter);
app.use("/groups", groupRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
