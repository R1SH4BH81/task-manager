import { z } from 'zod';

export const CreateUserDto = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const LoginUserDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const UpdateUserDto = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters').optional(),
  email: z.string().email('Invalid email format').optional()
});

export type CreateUserType = z.infer<typeof CreateUserDto>;
export type LoginUserType = z.infer<typeof LoginUserDto>;
export type UpdateUserType = z.infer<typeof UpdateUserDto>;