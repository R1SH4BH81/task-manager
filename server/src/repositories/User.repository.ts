import { User } from '@prisma/client';
import prisma from '../utils/prisma';

export class UserRepository {
  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      return await prisma.user.create({
        data: userData
      });
    } catch (error) {
      console.error('Error in UserRepository.create:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error in UserRepository.findById:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      console.error('Error in UserRepository.findByEmail:', error);
      throw error;
    }
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id },
        data: userData
      });
    } catch (error) {
      console.error('Error in UserRepository.update:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<User> {
    try {
      return await prisma.user.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error in UserRepository.delete:', error);
      throw error;
    }
  }
}