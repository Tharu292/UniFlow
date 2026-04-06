import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
  title: string;
  description: string;
  type: "PDF" | "Video" | "Image" | "Link";
  url: string;
  fileSize?: string;
  subject: string;
  uploadedBy: string;
  uploadedById?: mongoose.Types.ObjectId;
  downloads: number;
  status: "pending" | "approved" | "rejected";
  tags: string[];
  
  // Target Audience fields
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
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    type: {
      type: String,
      enum: ["PDF", "Video", "Image", "Link"],
      required: [true, "Resource type is required"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
    },
    fileSize: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    uploadedBy: {
      type: String,
      required: true,
      default: "Admin",
    },
    uploadedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    
    // Target Audience fields
    targetAudience: {
      type: String,
      enum: ["All Students", "By Faculty", "By Semester", "By Year"],
      required: [true, "Target audience is required"],
    },
    targetFaculty: {
      type: String,
      enum: ["Computing", "Business", "Engineering"],
      required: function(this: IResource) {
        return this.targetAudience === "By Faculty";
      },
    },
    targetSemester: {
      type: String,
      enum: ["Semester 1", "Semester 2", "Semester 3", "Semester 4"],
      required: function(this: IResource) {
        return this.targetAudience === "By Semester";
      },
    },
    targetYear: {
      type: String,
      enum: ["1", "2", "3", "4"],
      required: function(this: IResource) {
        return this.targetAudience === "By Year";
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ResourceSchema.index({ status: 1, createdAt: -1 });
ResourceSchema.index({ targetAudience: 1 });
ResourceSchema.index({ targetFaculty: 1 });
ResourceSchema.index({ targetSemester: 1 });
ResourceSchema.index({ targetYear: 1 });
ResourceSchema.index({ title: "text", description: "text", subject: "text" });

export const Resource = mongoose.model<IResource>("Resource", ResourceSchema);