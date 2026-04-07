// backend/src/controllers/resourceController.ts
import { Request, Response } from 'express';
import Resource from '../models/Resource';
import { AuthRequest } from '../types/express';
import mongoose from 'mongoose';


// Safe helper to convert req.params.id to ObjectId
const toObjectId = (id: string | string[] | undefined): mongoose.Types.ObjectId => {
  if (!id || Array.isArray(id)) {
    throw new Error('Valid ID is required');
  }
  return new mongoose.Types.ObjectId(id);
};


// CREATE Resource
export const createResource = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file as Express.Multer.File & { secure_url?: string; path?: string };

    // Robust tags handling
    let tags: string[] = [];
    const tagsRaw = req.body.tags;

    if (tagsRaw) {
      if (Array.isArray(tagsRaw)) {
        tags = tagsRaw.map(t => t.trim()).filter(Boolean);
      } else if (typeof tagsRaw === 'string') {
        tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
      }
    }

    const resource = await Resource.create({
      title: req.body.title,
      fileUrl: file.secure_url || file.path || '',
      fileName: file.originalname,
      module: req.body.module,
      semester: req.body.semester,
      year: req.body.year,
      tags: tags,
      description: req.body.description,
      createdBy: new mongoose.Types.ObjectId(req.user!.id)
    });

    res.status(201).json(resource);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL Resources
export const getResources = async (_req: Request, res: Response) => {
  try {
    
    const resources = await Resource.find().populate('createdBy', 'name email');
    res.json(resources);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET MY Resources
export const getMyResources = async (req: AuthRequest, res: Response) => {
  try {
    const resources = await Resource.find({
      createdBy: new mongoose.Types.ObjectId(req.user!.id)
    }).sort({ createdAt: -1 });

    res.json(resources);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE Resource
export const updateResource = async (req: AuthRequest, res: Response) => {
  try {
    const resource = await Resource.findOneAndUpdate(
      {
        _id: toObjectId(req.params.id),
        createdBy: new mongoose.Types.ObjectId(req.user!.id)
      },
      req.body,
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found or unauthorized' });
    }

    res.json(resource);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE Resource
export const deleteResource = async (req: AuthRequest, res: Response) => {
  try {
    const resource = await Resource.findOneAndDelete({
      _id: toObjectId(req.params.id),
      createdBy: new mongoose.Types.ObjectId(req.user!.id)
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found or unauthorized' });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};