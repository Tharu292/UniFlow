import { Request, Response } from 'express';
import Task from '../models/Task';

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await Task.find().sort({ dueDate: 1 });
  res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, type, dueDate, priority, description, resourceLink } = req.body;

    //Required
    if (!title || !type || !dueDate || !priority) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    //Title length
    if (title.length < 3 || title.length > 100) {
      return res.status(400).json({ message: 'Title must be between 3 and 100 characters' });
    }

    //Due date validation
    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({ message: 'Due date cannot be in the past' });
    }

    //Priority validation
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority value' });
    }

    //Description limit
    if (description && description.length > 500) {
      return res.status(400).json({ message: 'Description too long (max 500 characters)' });
    }

    //URL validation
    if (resourceLink) {
      try {
        new URL(resourceLink);
      } catch {
        return res.status(400).json({ message: 'Invalid resource link' });
      }
    }

    //Duplicate prevention
    const existing = await Task.findOne({ title, dueDate });
    if (existing) {
      return res.status(400).json({ message: 'Task with same title and date already exists' });
    }

    //If there are too many tasks same day
    const sameDayTasks = await Task.countDocuments({
      dueDate: {
        $gte: new Date(new Date(dueDate).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(dueDate).setHours(23, 59, 59, 999)),
      },
    });

    const task = await Task.create(req.body);

    return res.status(201).json({
      task,
      warning: sameDayTasks >= 5 ? 'Too many tasks scheduled on this day' : null,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { title, type, dueDate, priority, description, resourceLink } = req.body;

    if (!title || !type || !dueDate || !priority) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    if (title.length < 3 || title.length > 100) {
      return res.status(400).json({ message: 'Title must be between 3 and 100 characters' });
    }

    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({ message: 'Due date cannot be in the past' });
    }

    if (description && description.length > 500) {
      return res.status(400).json({ message: 'Description too long' });
    }

    if (resourceLink) {
      try {
        new URL(resourceLink);
      } catch {
        return res.status(400).json({ message: 'Invalid URL' });
      }
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(task);
  } catch {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};