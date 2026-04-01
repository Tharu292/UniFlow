/*import { Request, Response } from 'express';
import Resource from '../models/Resource';
import path from 'path';

export const getResources = async (req: Request, res: Response) => {
  const resources = await Resource.find();
  res.json(resources);
};

export const uploadResource = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const resource = await Resource.create({
    title: req.body.title,
    fileName: req.file.originalname,
    filePath: `/uploads/${req.file.filename}`,
    module: req.body.module,
    semester: req.body.semester,
    tags: req.body.tags ? req.body.tags.split(',') : [],
    description: req.body.description,
  });

  res.status(201).json(resource);
};

export const downloadResource = (req: Request, res: Response) => {
  const filePath = path.join(__dirname, '../../uploads', path.basename(req.params.filename));
  res.download(filePath);
};*/