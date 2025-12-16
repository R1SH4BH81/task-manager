import { z } from 'zod';

export const CreateTaskDto = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),

  description: z.string().nullable().optional(),

  dueDate: z.coerce.date(),

  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),

  status: z.enum(['ToDo', 'InProgress', 'Review', 'Completed']).default('ToDo'),

  assignedToId: z.string().nullable(), // ✅ FIX
});

export const UpdateTaskDto = z.object({
  title: z.string().min(1).max(100).optional(),

  description: z.string().nullable().optional(),

  dueDate: z.coerce.date().optional(),

  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),

  status: z.enum(['ToDo', 'InProgress', 'Review', 'Completed']).optional(),

  assignedToId: z.string().nullable().optional(), // ✅ FIX
});

export type CreateTaskType = z.infer<typeof CreateTaskDto>;
export type UpdateTaskType = z.infer<typeof UpdateTaskDto>;
