import mongoose, { Document, Schema } from "mongoose";

export interface IAnswer extends Document {
  content: string;
  votes: number;
  question: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  voters: mongoose.Types.ObjectId[];
}

const AnswerSchema = new Schema<IAnswer>(
  {
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
    question: { type: Schema.Types.ObjectId, ref: "Question" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    voters:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  { timestamps: true }
);

export default mongoose.model<IAnswer>("Answer", AnswerSchema);