import { PrismaClient, Task } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskRepository {
  async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return await prisma.task.create({
      data: taskData
    });
  }

  async findById(id: string): Promise<Task | null> {
    return await prisma.task.findUnique({
      where: { id }
    });
  }

  async findAll(): Promise<Task[]> {
    return await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findByUserId(userId: string): Promise<Task[]> {
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
  }

  async findByCreatorId(creatorId: string): Promise<Task[]> {
    return await prisma.task.findMany({
      where: { creatorId },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findByAssignedToId(assignedToId: string): Promise<Task[]> {
    return await prisma.task.findMany({
      where: { assignedToId },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOverdueTasks(): Promise<Task[]> {
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
  }

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    return await prisma.task.update({
      where: { id },
      data: taskData
    });
  }

  async delete(id: string): Promise<Task> {
    return await prisma.task.delete({
      where: { id }
    });
  }
}