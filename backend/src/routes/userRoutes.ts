import express, { Request, Response, NextFunction } from "express";
import User from "../models/User"; // Make sure you have User model
import { verifyToken } from "../middleware/authMiddleware"; // JWT verify middleware

const router = express.Router();

// GET PROFILE
router.get("/profile", verifyToken, async (req: any, res: Response) => {
  try {
    // req.user.id comes from verifyToken
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// UPDATE PROFILE
router.put("/profile", verifyToken, async (req: any, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true } // return updated doc
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// ADMIN ONLY: Get all students (example)
router.get(
  "/all",
  verifyToken,
  async (req: any, res: Response) => {
    try {
      // Only admin can access
      if (req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied" });

      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;