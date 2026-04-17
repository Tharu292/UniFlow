// backend/src/controllers/answerController.ts
import { Request, Response } from "express";
import Answer from "../models/Answer";
import Question from "../models/Question";
import mongoose from "mongoose";
import { updateGamification } from "../utils/gamification";
import { AuthRequest } from "src/types/express";

/**
 * ✅ Helper: Validate and convert ObjectId safely
 */
const getValidObjectId = (id: any): mongoose.Types.ObjectId | null => {
  if (!id || typeof id !== "string") return null;
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
};

/**
 * ✅ CREATE ANSWER
 */
export const createAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { content, questionId } = req.body;

    if (!content || content.trim().length < 10) {
      return res.status(400).json({ message: "Minimum 10 characters required" });
    }

    const qId = getValidObjectId(questionId);
    if (!qId) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    const question = await Question.findById(qId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.user.toString() === req.user!.id) {
      return res.status(400).json({ message: "Cannot answer your own question" });
    }

    const answer = await Answer.create({
      content: content.trim(),
      question: qId,
      user: req.user!.id,
    });

    await updateGamification(req.user!.id, "answer");

    res.json(answer);
  } catch (err) {
    console.error("Create Answer Error:", err);
    res.status(500).json({ message: "Failed to create answer" });
  }
};

/**
 * ✅ GET ANSWERS (🔥 FIXED ERROR HERE)
 */
export const getAnswers = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;

    const qId = getValidObjectId(questionId);
    if (!qId) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    const answers = await Answer.find({
      question: qId, // ✅ FIXED (no TS error)
    })
      .populate("user", "firstName lastName rank")
      .sort({ createdAt: -1 });

    res.json(answers);
  } catch (err) {
    console.error("Get Answers Error:", err);
    res.status(500).json({ message: "Failed to fetch answers" });
  }
};

/**
 * ✅ UPDATE ANSWER
 */
export const updateAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length < 10) {
      return res.status(400).json({ message: "Minimum 10 characters required" });
    }

    const answerId = getValidObjectId(req.params.id);
    const userId = getValidObjectId(req.user!.id);

    if (!answerId || !userId) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const answer = await Answer.findOneAndUpdate(
      {
        _id: answerId,
        user: userId, // ✅ ensures only owner can edit
      },
      { content: content.trim() },
      { new: true }
    ).populate("user", "firstName lastName");

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found or you don't have permission",
      });
    }

    res.json(answer);
  } catch (err) {
    console.error("Update Answer Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

/**
 * ✅ DELETE ANSWER
 */
export const deleteAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const answerId = getValidObjectId(req.params.id);
    if (!answerId) {
      return res.status(400).json({ message: "Invalid answer ID" });
    }

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.user.toString() !== req.user!.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await answer.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Answer Error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

/**
 * ✅ VOTE ANSWER (bonus fix for consistency)
 */
export const voteAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const answerId = getValidObjectId(req.params.id);
    if (!answerId) {
      return res.status(400).json({ message: "Invalid answer ID" });
    }

    const userId = req.user!.id;

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.voters.some((v: any) => v.toString() === userId)) {
      return res.status(400).json({ message: "Already voted" });
    }

    answer.votes += 1;
    answer.voters.push(new mongoose.Types.ObjectId(userId));

    await answer.save();

    await updateGamification(answer.user.toString(), "upvote");

    res.json(answer);
  } catch (err) {
    console.error("Vote Answer Error:", err);
    res.status(500).json({ message: "Vote failed" });
  }
};