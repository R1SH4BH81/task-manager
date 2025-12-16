import { Request, Response } from 'express';
import { UserService } from '../services/User.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dtos/User.dto';

const userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const userData = CreateUserDto.parse(req.body);

      // Register user
      const result = await userService.register(userData);

      res.status(201).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ message: 'Validation error', errors: error.errors });
        return;
      }
      
      if (error.message === 'User with this email already exists') {
        res.status(409).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const credentials = LoginUserDto.parse(req.body);

      // Authenticate user
      const result = await userService.login(credentials);

      res.json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ message: 'Validation error', errors: error.errors });
        return;
      }
      
      if (error.message === 'Invalid credentials') {
        res.status(401).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      
      const user = await userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      
      // Validate request body
      const userData = UpdateUserDto.parse(req.body);

      const updatedUser = await userService.updateUser(userId, userData);

      res.json(updatedUser);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ message: 'Validation error', errors: error.errors });
        return;
      }
      
      if (error.message === 'Email is already taken') {
        res.status(409).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  }
}