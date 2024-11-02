import express from "express";
import { Request, Response } from "express";
import { db } from "../index";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { sampleUsers } from "../../sample_data/users";
dotenv.config();

const userRouter = express.Router();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to create a new user and send a welcome email
userRouter.post("/", async (req: Request, res: Response) => {
  try {
    delete req.body._id;
    const result = await db.collection("users").insertOne(req.body);

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Welcome to Our App!",
      text: `Hi ${req.body.name},\n\nWelcome to our app! We're excited to have you here.\n\nBest Regards,\nThe Team`,
      html: `<h1>Welcome to Our App!</h1><p>Hi ${req.body.name},</p><p>We're excited to have you here.</p><p>Best Regards,<br>The Team</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ _id: result.insertedId, ...req.body });
    console.log("POST: Create User and sent welcome email");
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Additional routes for user-related operations
userRouter.post("/exists", async (req: Request, res: Response) => {
  const uid = req.body.uid;
  console.log("CHECK USER: ", uid);
  try {
    const user = await db.collection("users").findOne({ uid });
    if (user) {
      res.status(200).json({ userExists: true, user });
    } else {
      res.status(200).json({ userExists: false });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await db.collection("users").find({}).toArray();
    res.status(200).json({ users });
    console.log("GET: Get all Users");
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

userRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updates = req.body;

  try {
    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log(`PUT: Updating User ${id}`);
    res.status(200).json({ message: "success" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

userRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    res.status(204).json({ message: "success" });
    console.log(`DELETE: Delete User ${id}`);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

userRouter.get("/find-user/:query", async (req: Request, res: Response) => {
  const searchValue = req.params.query;
  try {
    const result = await db
      .collection("users")
      .find({
        $or: [
          { name: { $regex: searchValue, $options: "i" } },
          { email: { $regex: searchValue, $options: "i" } },
        ],
      })
      .toArray();
    res.status(200).json(result);
    console.log("GET: Search for Users");
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

userRouter.post("/get-chat-users", async (req: Request, res: Response) => {
  const userIDArray = req.body.users;
  try {
    const objectIdArray = userIDArray?.map((id: string) => new ObjectId(id));
    const result = await db
      .collection("users")
      .find({
        _id: { $in: objectIdArray },
      })
      .toArray();
    res.status(200).json({ data: result, message: "successful!" });
    console.log("POST: Get Chat User Data");
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

userRouter.post("/insert-many-users", async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    await db.collection("users").insertMany(sampleUsers, {
      ordered: true
    });
    res.status(200).json({ message: "inserted many users into the db." });
    console.log("POST: added many users to the db")
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});



export default userRouter;
