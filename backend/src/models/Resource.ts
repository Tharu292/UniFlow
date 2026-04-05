import mongoose, { Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  fileUrl: string;
  module?: string;
  semester?: string;
  year?: string;
  tags: string[];
  description?: string;
  createdBy?: string;
}

const resourceSchema = new mongoose.Schema<IResource>({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  module: String,
  semester: String,
  year: String,
  tags: [String],
  description: String,
  createdBy: String
}, { timestamps: true });

export default mongoose.model<IResource>('Resource', resourceSchema);