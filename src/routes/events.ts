import express from "express";
const eventsRouter = express.Router();

eventsRouter.get("/", async (req: any, res: any) => {
  try {
    res.status(200).json({ message: "events success" });
  } catch (err) {
    // res.status(500).json({ message: err.message });
  }
});

export default eventsRouter;
