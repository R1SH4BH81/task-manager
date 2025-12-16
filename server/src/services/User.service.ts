import { User } from '@prisma/client';
import { UserRepository } from '../repositories/User.repository';
import { hashPassword, comparePasswords, generateToken } from '../utils/auth.utils';
import { CreateUserType, LoginUserType, UpdateUserType } from '../dtos/User.dto';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: CreateUserType): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async login(credentials: LoginUserType): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await comparePasswords(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, userData: UpdateUserType): Promise<Omit<User, 'password'>> {
    // Check if email is being updated and if it's already taken
    if (userData.email) {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email is already taken');
      }
    }

    const user = await this.userRepository.update(id, userData);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUser(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.delete(id);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}