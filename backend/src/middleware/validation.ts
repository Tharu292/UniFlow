import { Request, Response, NextFunction } from 'express';

export const validateResource = (req: Request, res: Response, next: NextFunction) => {
  const { title, module, semester, year, description } = req.body;

  if (!title || title.length < 3)
    return res.status(400).json({ error: "Title must be at least 3 characters" });

  if (!module)
    return res.status(400).json({ error: "Module is required" });

  if (!semester)
    return res.status(400).json({ error: "Semester is required" });

  if (!year)
    return res.status(400).json({ error: "Year is required" });

  if (!description || description.length < 10)
    return res.status(400).json({ error: "Description too short" });

  next();
};