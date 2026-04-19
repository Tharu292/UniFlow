import express from "express";
import {
  getResources,
  getMyResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  incrementDownloads,
  getResourceStats,
} from "../controllers/resourceController";

import upload from "../middleware/upload";
import { validateResource } from "../middleware/validation";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ STATS (keep first)
router.get("/stats", getResourceStats);

// ✅ GET ALL (Library)
router.get("/", getResources);

// ✅ GET MY RESOURCES (Protected)
router.get("/my", verifyToken, getMyResources);

// ✅ GET SINGLE RESOURCE
router.get("/:id", getResourceById);

// ✅ CREATE (Protected + File Upload)
router.post(
  "/",
  verifyToken,
  upload.single("file"),
  validateResource,
  createResource
);

// ✅ UPDATE (Protected)
router.put("/:id", verifyToken, validateResource, updateResource);

// ✅ DELETE (Protected)
router.delete("/:id", verifyToken, deleteResource);

// ✅ DOWNLOAD COUNT
router.patch("/:id/download", incrementDownloads);

// ✅ STATUS UPDATE (Admin use)
//router.patch("/:id/status", updateResourceStatus);

export default router;