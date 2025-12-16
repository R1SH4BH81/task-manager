import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { AuthController } from './controllers/Auth.controller';
import { TaskController } from './controllers/Task.controller';
import { TaskService } from './services/Task.service';
import { authenticateToken } from './utils/auth.utils';
import prisma from './utils/prisma';

dotenv.config();

const app = express();
const server = createServer(app);

/* =========================
   CORS CONFIG (SINGLE SOURCE OF TRUTH)
========================= */

const allowedOrigins = [
  'https://task-manager-alpha-five-87.vercel.app', // prod frontend
  'http://localhost:5173',                         // vite dev
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman / curl
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

/* =========================
   SOCKET.IO
========================= */

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

/* =========================
   SERVICES / CONTROLLERS
========================= */

const authController = new AuthController();
const taskController = new TaskController();
const taskService = new TaskService();

taskService.setSocketIO(io);

/* =========================
   MIDDLEWARE (ORDER MATTERS)
========================= */

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // 🔑 PREFLIGHT FIX
app.use(express.json());

/* =========================
   ROUTES
========================= */

app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!' });
});

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', database: 'Connected' });
  } catch (error: any) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
      error: error.message,
    });
  }
});

/* AUTH */
app.post('/api/auth/register', (req, res) =>
  authController.register(req, res)
);
app.post('/api/auth/login', (req, res) =>
  authController.login(req, res)
);
app.get('/api/auth/profile', authenticateToken, (req, res) =>
  authController.getProfile(req, res)
);
app.put('/api/auth/profile', authenticateToken, (req, res) =>
  authController.updateProfile(req, res)
);

/* TASKS */
app.post('/api/tasks', authenticateToken, (req, res) =>
  taskController.createTask(req, res)
);
app.get('/api/tasks', authenticateToken, (req, res) =>
  taskController.getAllTasks(req, res)
);
app.get('/api/tasks/my', authenticateToken, (req, res) =>
  taskController.getMyTasks(req, res)
);
app.get('/api/tasks/:id', authenticateToken, (req, res) =>
  taskController.getTaskById(req, res)
);
app.put('/api/tasks/:id', authenticateToken, (req, res) =>
  taskController.updateTask(req, res)
);
app.delete('/api/tasks/:id', authenticateToken, (req, res) =>
  taskController.deleteTask(req, res)
);

/* =========================
   SOCKET EVENTS
========================= */

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (userId: string) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

/* =========================
   ERROR HANDLING
========================= */

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* =========================
   SERVER START
========================= */

const PORT = Number(process.env.PORT) || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

/* =========================
   GRACEFUL SHUTDOWN
========================= */

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
