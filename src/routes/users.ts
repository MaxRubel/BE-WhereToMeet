import express from "express";
const userRouter = express.Router();

userRouter.get("/", async (req: any, res: any) => {
  try {
    //do get shit
    res.status(200).json({ message: "users success" });
  } catch (err) {
    // res.status(500).json({ message: err.message });
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
