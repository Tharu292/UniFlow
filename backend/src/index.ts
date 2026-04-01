import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import taskRoutes from './routes/tasks';
//import resourceRoutes from './routes/resources';
import path from 'path';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/tasks', taskRoutes);
//app.use('/api/resources', resourceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));