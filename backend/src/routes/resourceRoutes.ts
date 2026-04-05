import express from 'express';
import {
  createResource,
  getResources,
  updateResource,
  deleteResource
} from '../controllers/resourceController';

import upload from '../middleware/upload';
import { validateResource } from '../middleware/validation';

const router = express.Router();

router.get('/', getResources);
router.post('/', upload.single('file'), validateResource, createResource);
router.put('/:id', validateResource, updateResource);
router.delete('/:id', deleteResource);

export default router;