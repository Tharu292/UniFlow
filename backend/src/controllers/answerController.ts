import { Request, Response } from "express";
import Answer, { IAnswer } from "../models/Answer";
import { updateGamification } from "../utils/gamification";
import { Document, DefaultSchemaOptions, Types } from "mongoose";

export const createAnswer = async (req: any, res: Response) => {
  const { content, questionId } = req.body;

   if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }
  if (!content || content.trim().length < 20) {
  return res.status(400).json({
    message: "Answer must be at least 20 characters"
  });
}


  const answer = await Answer.create({
    content,
    question: questionId,
    user: req.user
  });

  await updateGamification(req.user, "answer");

  res.json(answer);
};

export const getAnswers = async (req: Request, res: Response) => {
  const answers = await Answer.find({
    question: req.params.questionId
  }).populate("user", "name rank");

  res.json(answers);
};

 export const voteAnswer = async (req: any, res: Response) => {
  const userId = req.user;
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



export const deleteAnswer = async (req: any, res: Response) => {
  const answer = await Answer.findById(req.params.id);
  if (!answer) return res.status(404).json({ message: "Not found" });

  if (answer.user.toString() !== req.user)
    return res.status(403).json({ message: "Not allowed" });

  await answer.deleteOne();
  res.json({ message: "Deleted" });
};