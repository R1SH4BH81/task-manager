import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Controllers
import { AuthController } from './controllers/Auth.controller';
import { TaskController } from './controllers/Task.controller';

// Services
import { TaskService } from './services/Task.service';

// Middleware
import { authenticateToken } from './utils/auth.utils';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-domain.com'] 
      : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://localhost'],
    credentials: true
  }
});

// Initialize controllers
const authController = new AuthController();
const taskController = new TaskController();
const taskService = new TaskService();

// Set up Socket.IO for task service
taskService.setSocketIO(io);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://localhost'],
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!' });
});

// Auth routes
app.post('/api/auth/register', (req, res) => authController.register(req, res));
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.get('/api/auth/profile', authenticateToken, (req, res) => authController.getProfile(req, res));
app.put('/api/auth/profile', authenticateToken, (req, res) => authController.updateProfile(req, res));

// Task routes
app.post('/api/tasks', authenticateToken, (req, res) => taskController.createTask(req, res));
app.get('/api/tasks', authenticateToken, (req, res) => taskController.getAllTasks(req, res));
app.get('/api/tasks/my', authenticateToken, (req, res) => taskController.getMyTasks(req, res));
app.get('/api/tasks/:id', authenticateToken, (req, res) => taskController.getTaskById(req, res));
app.put('/api/tasks/:id', authenticateToken, (req, res) => taskController.updateTask(req, res));
app.delete('/api/tasks/:id', authenticateToken, (req, res) => taskController.deleteTask(req, res));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = parseInt(process.env.PORT || '5000', 10);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});