import express from "express";
import {
  createAnswer,
  getAnswers,
  voteAnswer,
  deleteAnswer
} from "../controllers/answerController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createAnswer);
router.get("/:questionId", getAnswers);
router.post("/vote/:id", protect, voteAnswer);
router.delete("/:id", protect, deleteAnswer);

export default router;