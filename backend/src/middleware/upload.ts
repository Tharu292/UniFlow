import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { Request } from 'express';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => ({
    folder: 'uniflow_resources',
    resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'auto', // <- important
    public_id: file.originalname.replace(/\.[^/.]+$/, ""),
    format: file.mimetype === 'application/pdf' ? 'pdf' : undefined,
    access_mode: 'public',
  }),
});

const upload = multer({ storage });
export default upload;