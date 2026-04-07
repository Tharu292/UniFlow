import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { verifyToken } from '../middleware/authMiddleware'; // ✅ ADD THIS

const router = Router();

// ✅ PROTECT ALL ROUTES
router.get('/', verifyToken, getTasks);
router.post('/', verifyToken, createTask);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, deleteTask);

export default router;