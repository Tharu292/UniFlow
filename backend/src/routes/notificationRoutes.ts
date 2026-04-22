import express from "express";
import {
  getNotifications,
  getStudentNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationStats,
  deleteExpiredNotifications,
} from "../controllers/notificationController";

const router = express.Router();

// Statistics route
router.get("/stats", getNotificationStats);

// Student-specific notifications
router.get("/student", getStudentNotifications);

// Bulk operations
router.delete("/bulk/expired", deleteExpiredNotifications);

// CRUD operations
router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.post("/", createNotification);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;