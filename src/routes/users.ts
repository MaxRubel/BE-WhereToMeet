import express from "express";
import { Request, Response } from "express";
import { db } from "../index";
import { ObjectId } from "mongodb";

const userRouter = express.Router();

//  Creates a new user to the DB
userRouter.post("/", async (req: Request, res: Response) => {
  try {
    delete req.body._id; //<-- delete the id
    const result = await db.collection("users").insertOne(req.body);
    res.status(200).json({ _id: result.insertedId, ...req.body });
    console.log("POST: Create User");
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//  Check if user exists
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

//  Update User
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

//  Deletes a User by the google auth userId
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

//  Search for User
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

//  Get All Chat Users
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

export default userRouter;
