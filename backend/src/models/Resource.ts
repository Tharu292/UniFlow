// backend/src/models/Resource.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  fileUrl: string;  
  fileName: string;         // We'll store the path like "/uploads/filename.pdf"
  module?: string;
  semester?: string;
  year?: string;
  tags: string[];
  description?: string;
  createdBy: mongoose.Types.ObjectId;
}

const resourceSchema = new mongoose.Schema<IResource>({
  title: { type: String, required: true, trim: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  module: { type: String, trim: true },
  semester: { type: String, trim: true },
  year: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  description: { type: String, trim: true },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { 
  timestamps: true 
});

export default mongoose.model<IResource>('Resource', resourceSchema);