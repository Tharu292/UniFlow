import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import crypto from 'crypto';

// Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/tasks";
import resourceRoutes from "./routes/resourceRoutes";

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/resources", resourceRoutes);

// Catch-all 404
app.use((req: Request, res: Response) => res.status(404).json({ message: "Route not found" }));

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Server Error:", err.stack || err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error", error: err.stack });
});

// MongoDB
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) { console.error("MONGO_URI not defined"); process.exit(1); }

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));