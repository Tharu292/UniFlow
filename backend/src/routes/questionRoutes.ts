import express from "express";
import {
  createQuestion,
  getQuestions,
  getQuestion,          // ← NEW
  deleteQuestion,
  updateQuestion
} from "../controllers/questionController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", verifyToken, createQuestion);
router.get("/", getQuestions);
router.get("/:id", getQuestion);       
router.put("/:id", verifyToken, updateQuestion);   // ← NEW    // ← NEW
router.delete("/:id", verifyToken, deleteQuestion);

export default router;