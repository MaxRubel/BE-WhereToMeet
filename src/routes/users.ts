import express from "express";
import { Request, Response } from "express";
import { db } from "../index";
import { User } from "../../dataTypes";

const userRouter = express.Router();

//  Creates a new user to the DB
userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const result = await db.collection("users").insertOne(req.body);
    res.status(200).json({ _id: result.insertedId, ...req.body });
    console.log("POST: Create User");
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//  Checks if user is in the database
userRouter.post("/exists", async (req: Request, res: Response) => {
  const userId = req.body.userId;
  console.log("checking user: ", userId);
  try {
    const user = await db.collection("users").findOne({ userId });
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

//  Gets All Users
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
  try {
    //do update shit
    res.status(200).json({ message: "success" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//  Deletes a User by the google auth userId
userRouter.delete("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    await db.collection("users").deleteOne({ userId });
    res.status(204).json({ message: "success" });
    console.log(`DELETE: Delete User ${userId}`);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default userRouter;
