import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
  title: string;
  description: string;

  // Resource type
  type: "PDF" | "Video" | "Image" | "Link";

  // File OR Link
  fileUrl?: string;
  fileName?: string;
  url?: string;

  fileSize?: string;
  subject: string;

  uploadedBy: string;
  uploadedById?: mongoose.Types.ObjectId;

  downloads: number;
  status: "pending" | "approved" | "rejected";

  tags: string[];

  // Target Audience
  targetAudience: "All Students" | "By Faculty" | "By Semester" | "By Year";
  targetFaculty?: string;
  targetSemester?: string;
  targetYear?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["PDF", "Video", "Image", "Link"],
      required: true,
    },

    // 🔥 SUPPORT BOTH FILE + LINK
    fileUrl: {
      type: String,
    },

    fileName: {
      type: String,
    },

    url: {
      type: String,
      trim: true,
    },

    fileSize: {
      type: String,
      default: "",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    uploadedBy: {
      type: String,
      default: "User",
    },

    uploadedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    downloads: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // 👈 change to pending if you want approval flow
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    targetAudience: {
      type: String,
      enum: ["All Students", "By Faculty", "By Semester", "By Year"],
      required: true,
    },

    targetFaculty: {
      type: String,
    },

    targetSemester: {
      type: String,
    },

    targetYear: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ResourceSchema.index({ status: 1, createdAt: -1 });
ResourceSchema.index({ title: "text", description: "text", subject: "text" });

export default mongoose.model<IResource>("Resource", ResourceSchema);