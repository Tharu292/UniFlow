// backend/src/middleware/validation.ts

import { Request, Response, NextFunction } from 'express';

export const validateResource = (req: Request, res: Response, next: NextFunction) => {
  const { 
    title, 
    description, 
    subject,           // ← now using subject instead of module
    targetAudience 
  } = req.body;

  // Required fields
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({ error: "Title must be at least 3 characters" });
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    return res.status(400).json({ error: "Subject is required" });
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return res.status(400).json({ error: "Description must be at least 10 characters" });
  }

  // Optional but if provided, validate targetAudience
  if (targetAudience && !["All Students", "By Faculty", "By Semester", "By Year"].includes(targetAudience)) {
    return res.status(400).json({ error: "Invalid targetAudience value" });
  }

  // For student uploads with file — we already check in controller if file or url exists
  // No need to force semester/year here anymore

  next();
};