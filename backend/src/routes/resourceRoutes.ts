import express from 'express';
import {
  createResource,
  getResources,
  getMyResources,
  updateResource,
  deleteResource
} from '../controllers/resourceController';

import upload from '../middleware/upload';
import { validateResource } from '../middleware/validation';
import { verifyToken } from '../middleware/authMiddleware'; // ✅ ADD

const router = express.Router();

router.get('/', getResources);

// ✅ PROTECT THIS
router.get('/my', verifyToken, getMyResources);

// ✅ PROTECT THESE
router.post('/', verifyToken, upload.single('file'), validateResource, createResource);
router.put('/:id', verifyToken, validateResource, updateResource);
router.delete('/:id', verifyToken, deleteResource);

export default router;