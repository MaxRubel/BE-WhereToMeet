import express, { Request, Response } from "express";
import { db } from "../index";
import { ObjectId } from "mongodb";

const groupsRouter = express.Router();

// GET groups of User
groupsRouter.get("/", async (req: any, res: any) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const groups = await db.collection("groups").find({ ownerId: userId }).toArray();
    console.log("GET: Groups of User: ", userId)
    res.status(200).json(groups);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

groupsRouter.get("/:id", async (req: any, res: any) => {
  const id = req.params.id
  console.log("GET: Single Group: ", id)
  try {
    const result = await db.collection("groups").findOne({ _id: new ObjectId(id) })
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

//GET Single Group
groupsRouter.get("/:id", async (req: any, res: any) => {
  const id = req.params.id
  console.log("GET: Single Group: ", id)
  try {
    const result = await db.collection("groups").findOne({ _id: new ObjectId(id) })
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE Group
groupsRouter.post("/", async (req: Request, res: Response) => {
  const dateCreated = new Date()
  try {
    const insertItem = { ...req.body, dateCreated }
    const result = await db.collection("groups").insertOne(insertItem);
    res
      .status(201)
      .json({
        message: "Group created successfully",
        data: { ...result, dateCreated }
      });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while creating the group" });
  }
});

// UPDATE Group
groupsRouter.put("/:id", async (request: Request, response: Response) => {
  delete request.body._id;

  const id = request.params.id;
  console.log(id)


  try {
    const result = await
      db.collection("groups").updateOne(
        { _id: new ObjectId(id) },
        { $set: request.body },
        { upsert: true })

    console.log("PUT: updating group ", id)
    response
      .status(201)
      .json({ message: "Group updated successfully", data: result });
  } catch (err) {
    console.error(err);
    response
      .status(500)
      .json({ message: "An error occurred while updating the group" });
  }
});

// DELETE Group
groupsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await db.collection("groups").deleteOne({ _id: new ObjectId(id) });
    res.status(204);
    console.log(`DELETE: Delete Group: ${id}`);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


//@ts-ignore
// ADD Member
groupsRouter.post("/add-member", async (req: Request, res: Response) => {
  try {
    const { groupId, memberId } = req.body;
    console.log(req.body);

    if (!groupId || !memberId) {
      return res
        .status(400)
        .json({ message: "groupId and memberId are required" });
    }

    const filter = { _id: new ObjectId(groupId) };
    const updateDoc = {
      $push: {
        members: {
          _id: memberId,
          joined: new Date(),
        },
      },
    };

    //@ts-ignore
    const result = await db.collection("groups").updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message: "Member not added. They may already be in the group.",
      });
    }

    console.log(`Added member ${memberId} to group ${groupId}`);
    res.status(200).json({ message: "Member added successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//@ts-ignore
//  REMOVE Member
groupsRouter.post("/remove-member", async (req: Request, res: Response) => {
  try {
    const { groupId, memberId } = req.body;

    if (!groupId || !memberId) {
      return res
        .status(400)
        .json({ message: "groupId and memberId are required" });
    }

    const filter = { _id: new ObjectId(groupId) };
    const updateDoc = {
      $pull: {
        members: { _id: memberId },
      },
    };

    //@ts-ignore
    const result = await db.collection("groups").updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Member not found in the group" });
    }

    console.log(`Removed member ${memberId} from group ${groupId}`);
    res.status(200).json({ message: "Member removed successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

groupsRouter.post("/get-members", async (req: any, res: any) => {
  //@ts-ignore
  const objectIds = req.body.map(id => new ObjectId(id));
  const query = { _id: { $in: objectIds } };
  try {
    const result = await db.collection("users").find(query).toArray();
    console.log("POST: retreive members of group")
    res.status(200).json(result);
  } catch (err: any) {
    console.error("error getting members of group, ", err)
    res.status(500).json({ message: err.message });
  }
});
export default groupsRouter;
