import express from "express";
import {
  createAnswer,
  getAnswers,
  voteAnswer,
  deleteAnswer,
  updateAnswer
} from "../controllers/answerController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", verifyToken, createAnswer);
router.get("/:questionId", getAnswers);
router.post("/vote/:id", verifyToken, voteAnswer);
router.put("/:id", verifyToken, updateAnswer);     // ← NEW
router.delete("/:id", verifyToken, deleteAnswer);

export default router;