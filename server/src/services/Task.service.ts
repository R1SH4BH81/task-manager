import { Task } from '@prisma/client';
import { TaskRepository } from '../repositories/Task.repository';
import { CreateTaskType, UpdateTaskType } from '../dtos/Task.dto';
import { Server } from 'socket.io';

export class TaskService {
  private taskRepository: TaskRepository;
  private io: Server | null = null;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  setSocketIO(io: Server) {
    this.io = io;
  }

  async createTask(taskData: CreateTaskType, creatorId: string): Promise<Task> {
    try {
      // Ensure description is null if not provided and assignedToId is properly typed
      const taskDataForDb = {
        ...taskData,
        description: taskData.description ?? null,
        assignedToId: taskData.assignedToId ?? null
      };

      const task = await this.taskRepository.create({
        ...taskDataForDb,
        creatorId
      });

      // Notify assigned user if task is assigned
      if (task.assignedToId && this.io) {
        this.io.to(task.assignedToId).emit('taskAssigned', task);
      }

      return task;
    } catch (error) {
      console.error('Error in TaskService.createTask:', error);
      throw error;
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      return await this.taskRepository.findById(id);
    } catch (error) {
      console.error('Error in TaskService.getTaskById:', error);
      throw error;
    }
  }

  async getAllTasks(): Promise<Task[]> {
    try {
      return await this.taskRepository.findAll();
    } catch (error) {
      console.error('Error in TaskService.getAllTasks:', error);
      throw error;
    }
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    try {
      return await this.taskRepository.findByUserId(userId);
    } catch (error) {
      console.error('Error in TaskService.getTasksByUserId:', error);
      throw error;
    }
  }

  async getTasksByCreatorId(creatorId: string): Promise<Task[]> {
    try {
      return await this.taskRepository.findByCreatorId(creatorId);
    } catch (error) {
      console.error('Error in TaskService.getTasksByCreatorId:', error);
      throw error;
    }
  }

  async getTasksAssignedToUser(assignedToId: string): Promise<Task[]> {
    try {
      return await this.taskRepository.findByAssignedToId(assignedToId);
    } catch (error) {
      console.error('Error in TaskService.getTasksAssignedToUser:', error);
      throw error;
    }
  }

  async getOverdueTasks(): Promise<Task[]> {
    try {
      return await this.taskRepository.findOverdueTasks();
    } catch (error) {
      console.error('Error in TaskService.getOverdueTasks:', error);
      throw error;
    }
  }

  async updateTask(id: string, taskData: UpdateTaskType, userId: string): Promise<Task> {
    try {
      // Check if user has permission to update task
      const existingTask = await this.taskRepository.findById(id);
      if (!existingTask) {
        throw new Error('Task not found');
      }

      // Only creator or assignee can update task
      if (existingTask.creatorId !== userId && existingTask.assignedToId !== userId) {
        throw new Error('Unauthorized to update this task');
      }

      // Ensure description is null if explicitly set to null or undefined
      const taskDataForDb = {
        ...taskData,
        description: taskData.description !== undefined ? taskData.description : undefined,
        assignedToId: taskData.assignedToId !== undefined ? taskData.assignedToId : undefined
      };

      const updatedTask = await this.taskRepository.update(id, taskDataForDb);

      // Notify relevant users of the update
      if (this.io) {
        // Notify creator
        this.io.to(existingTask.creatorId).emit('taskUpdated', updatedTask);
        
        // Notify assignee if different from creator
        if (existingTask.assignedToId && existingTask.assignedToId !== existingTask.creatorId) {
          this.io.to(existingTask.assignedToId).emit('taskUpdated', updatedTask);
        }
        
        // Notify new assignee if task was reassigned
        if (taskData.assignedToId && taskData.assignedToId !== existingTask.assignedToId) {
          this.io.to(taskData.assignedToId).emit('taskAssigned', updatedTask);
        }
      }

      return updatedTask;
    } catch (error) {
      console.error('Error in TaskService.updateTask:', error);
      throw error;
    }
  }

  async deleteTask(id: string, userId: string): Promise<Task> {
    try {
      // Check if user has permission to delete task
      const existingTask = await this.taskRepository.findById(id);
      if (!existingTask) {
        throw new Error('Task not found');
      }

      // Only creator can delete task
      if (existingTask.creatorId !== userId) {
        throw new Error('Unauthorized to delete this task');
      }

      const deletedTask = await this.taskRepository.delete(id);

      // Notify relevant users of the deletion
      if (this.io) {
        // Notify creator
        this.io.to(existingTask.creatorId).emit('taskDeleted', deletedTask);
        
        // Notify assignee if different from creator
        if (existingTask.assignedToId && existingTask.assignedToId !== existingTask.creatorId) {
          this.io.to(existingTask.assignedToId).emit('taskDeleted', deletedTask);
        }
      }

      return deletedTask;
    } catch (error) {
      console.error('Error in TaskService.deleteTask:', error);
      throw error;
    }
  }
}