import express from "express";
const groupsRouter = express.Router();

groupsRouter.get("/", async (req: any, res: any) => {
  try {
    res.status(200).json({ message: "success from groups" });
  } catch (err) {
    // res.status(500).json({ message: err.message });
  }
});

export default groupsRouter;
