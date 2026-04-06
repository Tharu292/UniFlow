import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User";

const MONGO_URL = "mongodb+srv://tharushikavi29_db_user:tharu123@cluster0.ieyoch1.mongodb.net/?appName=Cluster0";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URL);

    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin123@gmail.com",
      password: hashed,
      role: "admin",
      verified: true,
    });

    console.log("✅ Admin user created");

  } catch (err) {
    console.error(err);
  }
};

run();