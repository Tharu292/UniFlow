import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: {
      type: String,
      required: function (this: any) { return this.role === "student"; },
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
    rank: { type: String, default: "Bronze" },
    badges: { type: [String], default: [] },
    status: { type: String, enum: ["active", "pending", "inactive"], default: "pending" },
    firstLogin: { type: Date },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Virtual full name (used by forum/leaderboard)
userSchema.virtual("name").get(function (this: any) {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export default mongoose.model("User", userSchema);