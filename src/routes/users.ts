import express from "express";
import { Request, Response } from 'express';
import { db } from "../index";
import { User } from "../../dataTypes"

const userRouter = express.Router();

/**
 * Creates a new user to the DB
 */
userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const result = await db.collection<User>('users').insertOne(req.body);
    res.status(200).json({ _id: result.insertedId, ...req.body });
    console.log("POST: Create User")
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ message: err.message });
  }
});

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "users success" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.put("/:id", async (req: any, res: any) => {
  try {
    //do update shit
    res.status(200).json({ message: "success" });
  } catch (err) {
    // res.status(500).json({ message: err.message });
  }
});

userRouter.delete("/:id", async (req: any, res: any) => {
  try {
    //do delete shit
    res.status(200).json({ message: "success" });
  } catch (err) {
    // res.status(500).json({ message: err.message });
  }
});


export default userRouter;
