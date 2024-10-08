import express from "express";
import {db} from "../index";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
const eventsRouter = express.Router();

//Create a new events to the DB
eventsRouter.post("/", async (req: Request, res: Response) => {
  try {
    delete req.body._id;
    const result = await db.collection("events").insertOne(req.body);
    res.status(200).json({ _id: result.insertedId, ...req.body});
    console.log("POST: Create event");
  } catch(err:any){
    console.error(err);
    res.status(500).json({ message:err.message})
  }
});

// Gets All Events
eventsRouter.get("/", async (req: any, res: any) => {
  try {
    const events = await db.collection("events").find({}).toArray();
    res.status(200).json({ events });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a Event
eventsRouter.delete("/:id", async (req: Request, res: Response) => {
  try{
    const id = req.params.id;
    await db.collection("events").deleteOne({ _id: new ObjectId(id)});
    res.status(204).json({ message: "sucess"});
    console.log(`DELETE: Delete Event ${id}`);

  } catch (err: any){
    console.error(err);
    res.status(500).json({message: err.message});
  }
});

// update an Event
eventsRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updates = req.body;

  try {
    await db.collection("events").updateOne(
      { _id: new ObjectId(id) }, 
      { $set: updates }  
    );
    console.log(`PUT: Updating Event ${id}`);
    res.status(200).json({ message: "success" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});



export default eventsRouter;
