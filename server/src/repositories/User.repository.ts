import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return await prisma.user.create({
      data: userData
    });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: userData
    });
  }

  async delete(id: string): Promise<User> {
    return await prisma.user.delete({
      where: { id }
    });
  }
}