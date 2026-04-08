import { Request, Response } from "express";
import Answer from "../models/Answer";
import { updateGamification } from "../utils/gamification";
import Question from "../models/Question";

export const createAnswer = async (req: any, res: Response) => {
  const { content, questionId } = req.body;

  if (!content || content.trim().length < 20) {
    return res.status(400).json({ message: "Answer must be at least 20 characters" });
  }

  // Prevent answering your own question
  const question = await Question.findById(questionId);
  if (!question) return res.status(404).json({ message: "Question not found" });

  if (question.user.toString() === req.user.id) {
    return res.status(400).json({ message: "You cannot answer your own question" });
  }

  const answer = await Answer.create({
    content,
    question: questionId,
    user: req.user.id,
  });

  await updateGamification(req.user.id, "answer");
  res.json(answer);
};


export const getAnswers = async (req: Request, res: Response) => {
  const questionId = req.params.questionId;

  if (!questionId) {
    return res.status(400).json({ message: "Question ID is required" });
  }

  const answers = await Answer.find({
    question: questionId
  }).populate("user", "firstName lastName rank");

  res.json(answers);
};

export const voteAnswer = async (req: any, res: Response) => {
  const userId = req.user.id;                         // ← FIXED
  const answer = await Answer.findById(req.params.id);
  if (!answer) return res.status(404).json({ message: "Not found" });

  if (answer.voters.some((v: any) => v.toString() === userId)) {
    return res.status(400).json({ message: "You already voted" });
  }

  answer.votes += 1;
  answer.voters.push(userId);
  await answer.save();

  await updateGamification(answer.user.toString(), "upvote");
  res.json(answer);
};

export const updateAnswer = async (req: any, res: Response) => {
  const answer = await Answer.findById(req.params.id);
  if (!answer) return res.status(404).json({ message: "Answer not found" });

  if (answer.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "You can only edit your own answer" });
  }

  const updated = await Answer.findByIdAndUpdate(req.params.id, { content: req.body.content }, { new: true });
  res.json(updated);
};

export const deleteAnswer = async (req: any, res: Response) => {
  const answer = await Answer.findById(req.params.id);
  if (!answer) return res.status(404).json({ message: "Answer not found" });

  if (answer.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "You can only delete your own answer" });
  }

  await answer.deleteOne();
  res.json({ message: "Answer deleted successfully" });
};