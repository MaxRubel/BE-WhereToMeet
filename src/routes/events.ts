import express from "express";
import { db } from "../index";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { isPrimitive } from "util";
const eventsRouter = express.Router();

//Create a new events to the DB
eventsRouter.post("/", async (req: Request, res: Response) => {
  try {
    delete req.body._id;
    const result = await db.collection("events").insertOne(req.body);
    res.status(200).json({ _id: result.insertedId, ...req.body });
    console.log("POST: Create event");
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
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

// Get Single Event
eventsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const event = await db
      .collection("events")
      .findOne({ _id: new ObjectId(id) });

    // if (!event) {
    //   return res.status(404).json({ message: "Event not found" });
    // }

    res.status(200).json(event);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get events for users groups
eventsRouter.get(
  "/user-events/:id",
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string;
    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }

    try {
      const userGroups = await db
        .collection("groups")
        .find({
          "members._id": userId,
        })
        .toArray();
      const groupIds = userGroups.map((group) => group._id.toString());

      const events = await db
        .collection("events")
        .find({
          groupId: { $in: groupIds },
        })
        .toArray();

      res.status(200).json({ events });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Delete a Event
eventsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await db.collection("events").deleteOne({ _id: new ObjectId(id) });
    res.status(204).json({ message: "sucess" });
    console.log(`DELETE: Delete Event ${id}`);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// update an Event
eventsRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updates = req.body;

  delete req.body._id;

  try {
    await db
      .collection("events")
      .updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log(`PUT: Updating Event ${id}`);
    res.status(200).json({ message: "success" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Add Suggestion to Event
eventsRouter.post(
  "/add-suggestion",
  async (request: Request, response: Response) => {
    const { eventId } = request.body;

    try {
      db.collection("events").updateOne(
        { _id: ObjectId.createFromHexString(eventId) },
        { $push: { suggestions: request.body } }
      );
      console.log("POST: adding suggestion to event: ", eventId);
      response.status(200).json({ message: "success" });
    } catch (err: any) {
      console.error(err);
      response.status(500).json({ message: err.message });
    }
  }
);

// Remove Suggestion to Event
eventsRouter.post(
  "/remove-suggestion",
  async (request: Request, response: Response) => {
    const { eventId, suggestionId } = request.body;

    try {
      db.collection("events").updateOne(
        { _id: ObjectId.createFromHexString(eventId) },
        //@ts-ignore
        { $pull: { suggestions: { _id: suggestionId } } }
      );
      console.log("POST: removing suggestion from event: ", eventId);
      response.status(200).json({ message: "success" });
    } catch (err: any) {
      console.error(err);
      response.status(500).json({ message: err.message });
    }
  }
);

export default eventsRouter;

// Add vote to Suggestion
// userId, event_id
//@ts-ignore
eventsRouter.post("/add-vote", async (req: Request, res: Response) => {
  try {
    const { suggestionId, userId } = req.body;

    if (!suggestionId || !userId) {
      return res
        .status(400)
        .json({ message: "SuggestionId and userId are required" });
    }

    const existingVote = await db.collection('events').findOne({
      "suggestions._id": suggestionId,
      "suggestions.votes.voter": userId
    });

    if (existingVote) {
      const remVote = await db.collection('events').updateOne(
        { "suggestions._id": suggestionId },
        {
          $pull: {
            "suggestions.$.votes": {
              voter: userId
            }
          } as any
        }
      );

      if (remVote.modifiedCount === 0) {
        return res.status(404).json({ message: "suggestion not found" })
      }
    } else {
      const addVote = await db.collection('events').updateOne(
        { "suggestions._id": suggestionId },
        {
          $push: {
            "suggestions.$.votes": {
              voter: userId
            }
          } as any
        }
      );

      if (addVote.modifiedCount === 0) {
        return res.status(404).json({ message: "suggestion not found" })
      }
    }

    const updatedEvent = await db.collection('events').findOne(
      { "suggestions._id": suggestionId },
      { projection: { "suggestions.$": 1 } }
    );

    if (!updatedEvent || !updatedEvent.suggestions[0]) {
      return res.status(404).json({ message: "Suggestion not found" });
    }
    //@ts-ignore
    const updatedSuggestion = updatedEvent.suggestions[0];
    const voteCount = updatedSuggestion.votes.length;
    const action = existingVote ? 'removed' : 'added';

    res.status(200).json({
      message: `Vote ${action} successfully`,
      voteCount,
      suggestion: updatedSuggestion
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

eventsRouter.get("/check-privacy/:id", async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const result = await db.collection("events").findOne({ _id: new ObjectId(id) })
    if (!result) {
      res.status(400).json({ error: "no event with that id exists" })
      return
    }
    if (result.private) {
      res.status(200).json({ isPrivate: true })
    } else {
      res.status(200).json({ isPrivate: false })
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})
