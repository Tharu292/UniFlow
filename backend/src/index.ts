import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import dns from "node:dns";

// Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import userRoutesAdmin from "./routes/userRoutesAdmin";
import resourceRoutes from "./routes/resourceRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import taskRoutes from "./routes/tasks";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();
const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin/users", userRoutesAdmin);
app.use("/api/resources", resourceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/tasks", taskRoutes);

// --------------------
// Root route
// --------------------
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "UniFlow API Server",
    endpoints: {
      auth: "/api/auth",
      users: "/api/user",
      notifications: "/api/notifications",
      resources: "/api/resources",
    },
  });
});

// --------------------
// Catch-all for undefined routes
// --------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// --------------------
// Global error handler
// --------------------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🔥 Server Error:", err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// --------------------
// MongoDB connection
// --------------------
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not defined in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));