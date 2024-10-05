import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/users";
import groupRouter from "./routes/groups";
import eventRouter from "./routes/events";
import { MongoClient, Db } from "mongodb";

const cors = require("cors");

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

if (!PORT || !ALLOWED_ORIGIN || !MONGO_URI || !MONGO_DB_NAME) {
  console.error(
    "ENV variables not set correctly. Please double check env file"
  );
  // process.exit(1);
}

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
  res.send(
    "Hello and welcome to this api endpoint. I hope you acheive all your dreams in life and I love you 🤟."
  );
});

let client: MongoClient;
let db: Db;

async function connectToMongo() {
  try {
    if (!MONGO_URI) {
      console.error(
        "No Mongo Port specified.  Please double check env variables"
      );
      process.exit(1);
    }
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(MONGO_DB_NAME);
    console.log("💪💪 Connection to MongoDB successful");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

async function startServer() {
  await connectToMongo();

  app.listen(PORT, () => {
    console.log(`💪💪💪 Server is running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

export { db, client };
