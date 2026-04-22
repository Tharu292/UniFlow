import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  priority: "High" | "Medium" | "Low";
  targetAudience: string;
  targetFaculty: string;
  targetSemester: string;
  targetYear: string;
  expiryDate: Date;
  status: "active" | "expired";
  views: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title must be less than 100 characters"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: [20, "Message must be at least 20 characters"],
      maxlength: [500, "Message must be less than 500 characters"],
      trim: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
      required: true,
    },
    targetAudience: {
      type: String,
      required: [true, "Target audience is required"],
      enum: ["All Students", "By Faculty", "By Semester", "By Year"],
      default: "All Students",
    },
    targetFaculty: {
      type: String,
      enum: ["", "Computing", "Business", "Engineering", "All"],
      default: "",
    },
    targetSemester: {
      type: String,
      enum: ["", "Semester 1", "Semester 2", "All"],
      default: "",
    },
    targetYear: {
      type: String,
      enum: ["", "1", "2", "3", "4", "All"],
      default: "",
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
      validate: {
        validator: function(value: Date) {
          return value >= new Date();
        },
        message: "Expiry date must be today or in the future",
      },
    },
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: String,
      default: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to update status based on expiry date
NotificationSchema.pre("save", function(next) {
  if (this.expiryDate < new Date()) {
    this.status = "expired";
  } else {
    this.status = "active";
  }
});

// Indexes for better query performance
NotificationSchema.index({ status: 1, priority: 1, createdAt: -1 });
NotificationSchema.index({ targetAudience: 1, targetFaculty: 1, targetSemester: 1, targetYear: 1 });
NotificationSchema.index({ expiryDate: 1 });

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);