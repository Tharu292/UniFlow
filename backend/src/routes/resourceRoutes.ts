import express from "express";
import {
  getResources,
  getStudentResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  updateResourceStatus,
  incrementDownloads,
  getResourceStats,
} from "../controllers/resourceController";

const router = express.Router();

// Statistics route (MUST be before parameterized routes)
router.get("/stats", getResourceStats);

// Student routes
router.get("/student", getStudentResources);

// Download counter
router.patch("/:id/download", incrementDownloads);

// Admin routes
router.get("/admin", getResources);
router.get("/:id", getResourceById);
router.post("/", createResource);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);
router.patch("/:id/status", updateResourceStatus);

export default router;