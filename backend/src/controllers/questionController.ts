import { Request, Response } from "express";
import Question from "../models/Question";

export const createQuestion = async (req: any, res: Response) => {
  const { title, description } = req.body;

  const question = await Question.create({
    title,
    description,
    user: req.user
  });

  res.json(question);
};

export const getQuestions = async (_req: Request, res: Response) => {
  const questions = await Question.find().populate("user", "name");
  res.json(questions);
};

export const deleteQuestion = async (req: any, res: Response) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: "Not found" });

  if (question.user.toString() !== req.user)
    return res.status(403).json({ message: "Not allowed" });

  await question.deleteOne();
  res.json({ message: "Deleted" });
};