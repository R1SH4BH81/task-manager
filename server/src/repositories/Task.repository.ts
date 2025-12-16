import { Task } from '@prisma/client';
import prisma from '../utils/prisma';

export class TaskRepository {
  async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    try {
      return await prisma.task.create({
        data: taskData
      });
    } catch (error) {
      console.error('Error in TaskRepository.create:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Task | null> {
    try {
      return await prisma.task.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error in TaskRepository.findById:', error);
      throw error;
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      return await prisma.task.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error in TaskRepository.findAll:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Task[]> {
    try {
      return await prisma.task.findMany({
        where: {
          OR: [
            { creatorId: userId },
            { assignedToId: userId }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error in TaskRepository.findByUserId:', error);
      throw error;
    }
  }

  async findByCreatorId(creatorId: string): Promise<Task[]> {
    try {
      return await prisma.task.findMany({
        where: { creatorId },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error in TaskRepository.findByCreatorId:', error);
      throw error;
    }
  }

  async findByAssignedToId(assignedToId: string): Promise<Task[]> {
    try {
      return await prisma.task.findMany({
        where: { assignedToId },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error in TaskRepository.findByAssignedToId:', error);
      throw error;
    }
  }

  async findOverdueTasks(): Promise<Task[]> {
    try {
      const now = new Date();
      return await prisma.task.findMany({
        where: {
          dueDate: {
            lt: now
          },
          status: {
            not: 'Completed'
          }
        },
        orderBy: {
          dueDate: 'asc'
        }
      });
    } catch (error) {
      console.error('Error in TaskRepository.findOverdueTasks:', error);
      throw error;
    }
  }

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    try {
      return await prisma.task.update({
        where: { id },
        data: taskData
      });
    } catch (error) {
      console.error('Error in TaskRepository.update:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<Task> {
    try {
      return await prisma.task.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error in TaskRepository.delete:', error);
      throw error;
    }
  }
}