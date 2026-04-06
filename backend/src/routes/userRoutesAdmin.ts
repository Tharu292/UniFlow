// backend/src/routes/userRoutes.ts
import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  getUserStats,
} from "../controllers/userController";

const router = express.Router();

// Statistics route (before ID route)
router.get("/stats", getUserStats);

// CRUD operations
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/status", updateUserStatus);

export default router;