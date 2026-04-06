import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { Request } from 'express'; // import Request for typing
import { access } from 'node:fs';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async(req:Request, file:Express.Multer.File)=>({
    folder: 'uniflow_resources',
    resource_type: 'image',

    public_id:file.originalname.replace(/\.[^/.]+$/, ""),
    // Optional: force the file to be a .pdf in URL
    type:'upload',
    format: 'pdf',
    access_mode:'public'
  })
}); 

const upload = multer({ storage });

export default upload;