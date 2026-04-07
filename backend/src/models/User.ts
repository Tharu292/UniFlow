// backend/src/models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
      contactNumber: {
      type: String,
      required: function (this: any) {
        return this.role === "student";
      },
      default: "",
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    verified: { type: Boolean, default: false },
    address: { type: String, default: "" },
    faculty: { type: String, default: "" },
    semester: { type: String, default: "" },
    year: { type: String, default: "" },
    points: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "pending", "inactive"], default: "pending" },
    firstLogin: { type: Date },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);


/*import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  points: number;
  rank: string;
  badges: string[];
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    points: { type: Number, default: 0 },
    rank: { type: String, default: "Bronze" },
    badges: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);*/