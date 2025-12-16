import { Request, Response } from 'express';
import { TaskService } from '../services/Task.service';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/Task.dto';

const taskService = new TaskService();

export class TaskController {
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      
      // Validate request body
      const taskData = CreateTaskDto.parse(req.body);

      const task = await taskService.createTask(taskData, userId);

      res.status(201).json(task);
    } catch (error: any) {
      console.error('Error creating task:', error); // Add detailed logging
      
      if (error.name === 'ZodError') {
        res.status(400).json({ message: 'Validation error', errors: error.errors });
        return;
      }

      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const task = await taskService.getTaskById(id);
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.json(task);
    } catch (error) {
      console.error('Error fetching task:', error); // Add detailed logging
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error); // Add detailed logging
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getMyTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      
      const tasks = await taskService.getTasksByUserId(userId);
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching user tasks:', error); // Add detailed logging
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Validate request body
      const taskData = UpdateTaskDto.parse(req.body);

      const task = await taskService.updateTask(id, taskData, userId);

      res.json(task);
    } catch (error: any) {
      console.error('Error updating task:', error); // Add detailed logging
      
      if (error.name === 'ZodError') {
        res.status(400).json({ message: 'Validation error', errors: error.errors });
        return;
      }
      
      if (error.message === 'Task not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      
      if (error.message === 'Unauthorized to update this task') {
        res.status(403).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      const task = await taskService.deleteTask(id, userId);

      res.json({ message: 'Task deleted successfully', task });
    } catch (error: any) {
      console.error('Error deleting task:', error); // Add detailed logging
      
      if (error.message === 'Task not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      
      if (error.message === 'Unauthorized to delete this task') {
        res.status(403).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}