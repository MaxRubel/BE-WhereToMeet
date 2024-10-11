import express, { Request, Response } from "express";
import { db } from "../index";
import { ObjectId } from "mongodb";

const groupsRouter = express.Router();

// GET all groups (TEST FUNCTION
groupsRouter.get("/", async (req: any, res: any) => {
  try {
    res.status(200).json({ message: "success from groups" });
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
  try {
    await db.collection("groups").insertOne(req.body);
    res
      .status(201)
      .json({ message: "Group created successfully", data: req.body });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while creating the group" });
  }
});

// UPDATE Group
groupsRouter.put("/:id", async (req: Request, res: Response) => {
  delete req.body._id;

  const id = req.params.id;

  const filter = { _id: new ObjectId(id) };
  const update = {
    $set: {
      name: req.body.name,
      description: req.body.description,
    },
  };

  const options = { upsert: false };

  try {
    const result = await db
      .collection("groups")
      .updateOne(filter, update, options);
    res
      .status(201)
      .json({ message: "Group updated successfully", data: result });
  } catch (err) {
    console.error(err);
    res
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

export default groupsRouter;
