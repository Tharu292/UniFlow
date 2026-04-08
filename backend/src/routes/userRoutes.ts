import express, { Request, Response } from "express";
import User from "../models/User";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

// ======================
// USER PROFILE ROUTES
// ======================

// GET PROFILE (Protected)
router.get("/profile", verifyToken, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// UPDATE PROFILE (Protected)
router.put("/profile", verifyToken, async (req: any, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// ======================
// LEADERBOARD ROUTE
// ======================
const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "student" })
      .select("firstName lastName rank points badges")
      .sort({ points: -1 })
      .limit(20);

    const leaderboard = users.map(user => ({
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      rank: user.rank || "Bronze",
      points: user.points || 0,
      badges: user.badges || []
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

router.get("/leaderboard", getLeaderboard);

// ======================
// ADMIN ROUTES
// ======================

// ADMIN ONLY: Get all students
router.get(
  "/all",
  verifyToken,
  async (req: any, res: Response) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;