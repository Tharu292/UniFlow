// resources.ts
/*import { Router } from 'express';
import multer from 'multer';
import { getResources, uploadResource, downloadResource } from '../controllers/resourceController';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

const router = Router();
router.get('/', getResources);
router.post('/', upload.single('file'), uploadResource);
router.get('/download/:filename', downloadResource);

export default router;*/