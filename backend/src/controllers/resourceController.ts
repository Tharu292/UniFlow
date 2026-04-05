import { Request, Response } from 'express';
import Resource from '../models/Resource';

// CREATE
export const createResource = async (req: Request, res: Response) => {
  try {
    const resource = new Resource({
      ...req.body,
      fileUrl: (req.file as any)?.path
    });

    await resource.save();
    res.json(resource);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
export const getResources = async (req: Request, res: Response) => {
  const resources = await Resource.find();
  res.json(resources);
};

// UPDATE
export const updateResource = async (req: Request, res: Response) => {
  try {
    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteResource = async (req: Request, res: Response) => {
  await Resource.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};