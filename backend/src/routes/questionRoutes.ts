import express from "express";
import {
  createQuestion,
  getQuestions,
  deleteQuestion
} from "../controllers/questionController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createQuestion);
router.get("/", getQuestions);
router.delete("/:id", protect, deleteQuestion);

export default router;