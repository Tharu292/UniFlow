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
    verified: { type: Boolean, default: false }, // ✅ email verification status
    address: { type: String, default: "" },
    faculty: { type: String, default: "" },
    semester: { type: String, default: "" },
    year: { type: String, default: "" },
    firstLogin: { type: Date },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);