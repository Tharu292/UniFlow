import { Request, Response } from "express";
import Question from "../models/Question";

export const createQuestion = async (req: any, res: Response) => {
  const { title, description } = req.body;

  const question = await Question.create({
    title,
    description,
    user: req.user.id,
  });

  res.json(question);
};

export const getQuestions = async (_req: Request, res: Response) => {
  const questions = await Question.find().populate("user", "firstName lastName");
  res.json(questions);
};

export const getQuestion = async (req: Request, res: Response) => {
  const question = await Question.findById(req.params.id).populate("user", "firstName lastName");
  if (!question) return res.status(404).json({ message: "Question not found" });
  res.json(question);
};

// NEW: Update your own question
export const updateQuestion = async (req: any, res: Response) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: "Question not found" });

  if (question.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "You can only edit your own question" });
  }

  const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// NEW: Delete your own question
export const deleteQuestion = async (req: any, res: Response) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: "Question not found" });

  if (question.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "You can only delete your own question" });
  }

  await question.deleteOne();
  res.json({ message: "Question deleted successfully" });
};