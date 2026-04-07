import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  description: string;
  user: mongoose.Types.ObjectId;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model<IQuestion>("Question", QuestionSchema);