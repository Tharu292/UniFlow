// backend/src/controllers/taskController.ts
import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../types/express';
import mongoose from 'mongoose';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
  return res.status(401).json({ message: "Unauthorized" });
}
    const tasks = await Task.find({
      userId: new mongoose.Types.ObjectId(req.user!.id)
    }).sort({ dueDate: 1 });

    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: new mongoose.Types.ObjectId(req.user!.id)
    });

    res.status(201).json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: new mongoose.Types.ObjectId(req.user!.id)
      },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: new mongoose.Types.ObjectId(req.user!.id)
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};