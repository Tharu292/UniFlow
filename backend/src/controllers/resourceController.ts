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
// CREATE Resource (student or admin)
// backend/src/controllers/resourceController.ts

// In resourceController.ts → createResource function

export const createResource = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file as any;

    let tags: string[] = [];
    if (req.body.tags) {
      tags = typeof req.body.tags === 'string' 
        ? req.body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : Array.isArray(req.body.tags) ? req.body.tags : [];
    }

    const resourceData: any = {
      title: req.body.title?.trim(),
      description: req.body.description?.trim(),
      type: req.body.type || 'PDF',
      subject: req.body.subject?.trim(),
      uploadedBy: req.user?.name || 'Student',
      uploadedById: req.user ? new mongoose.Types.ObjectId(req.user.id) : undefined,
      tags,
      targetAudience: req.body.targetAudience || 'All Students',
      targetFaculty: req.body.targetFaculty,
      targetSemester: req.body.targetSemester,
      targetYear: req.body.targetYear,
      status: 'approved',
    };

    if (req.file) {
      resourceData.fileUrl = file.secure_url || file.path;
      resourceData.fileName = file.originalname;
    } else if (req.body.url) {
      resourceData.url = req.body.url;
    }

    // Final safety check
    if (!resourceData.subject) {
      return res.status(400).json({ error: "Subject is required" });
    }

    const resource = await Resource.create(resourceData);
    res.status(201).json(resource);

  } catch (err: any) {
    console.error("Create Resource Error:", err);
    res.status(500).json({ error: err.message });
  }
};
// GET ALL Resources
export const getResources = async (_req: Request, res: Response) => {
  try {
    
    const resources = await Resource.find().populate('uploadedById', 'name email');
    res.json(resources);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const getResourceById = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(resource);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET MY Resources
export const getMyResources = async (req: AuthRequest, res: Response) => {
  try {
    const resources = await Resource.find({
      uploadedById: new mongoose.Types.ObjectId(req.user!.id)
    }).sort({ createdAt: -1 });

    res.json(resources);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateResource = async (req: AuthRequest, res: Response) => {
  try {
    const allowedUpdates = [
      'title', 'description', 'subject', 'targetAudience',
      'targetFaculty', 'targetSemester', 'targetYear', 'tags'
    ];

    const updates: any = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const resource = await Resource.findOneAndUpdate(
      {
        _id: toObjectId(req.params.id),
        uploadedById: new mongoose.Types.ObjectId(req.user!.id)
      },
      updates,
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
      uploadedById: new mongoose.Types.ObjectId(req.user!.id)
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found or unauthorized' });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const incrementDownloads = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    res.json(resource);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateResourceStatus = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(resource);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const getResourceStats = async (_req: Request, res: Response) => {
  try {
    const total = await Resource.countDocuments();
    const approved = await Resource.countDocuments({ status: "approved" });
    const pending = await Resource.countDocuments({ status: "pending" });

    res.json({
      total,
      approved,
      pending
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};