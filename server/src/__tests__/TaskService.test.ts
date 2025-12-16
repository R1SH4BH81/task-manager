import { TaskService } from '../services/Task.service';
import { Priority, Status } from '@prisma/client';

// Mock the TaskRepository
jest.mock('../repositories/Task.repository');

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task with valid data', async () => {
      const mockTaskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: Priority.Medium as any,
        status: Status.ToDo as any
      };

      const mockCreatedTask = {
        id: '1',
        ...mockTaskData,
        creatorId: 'user1',
        assignedToId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock the repository method
      const taskRepositoryMock = (taskService as any).taskRepository;
      taskRepositoryMock.create.mockResolvedValue(mockCreatedTask);

      const result = await taskService.createTask(mockTaskData, 'user1');

      expect(result).toEqual(mockCreatedTask);
      expect(taskRepositoryMock.create).toHaveBeenCalledWith({
        ...mockTaskData,
        description: 'Test Description',
        assignedToId: null,
        creatorId: 'user1'
      });
    });
  });

  describe('updateTask', () => {
    it('should update a task when user is authorized', async () => {
      const taskId = '1';
      const userId = 'user1';
      const updateData = { title: 'Updated Title' };

      const existingTask = {
        id: taskId,
        title: 'Original Title',
        description: 'Test Description',
        dueDate: new Date(),
        priority: Priority.Medium as any,
        status: Status.ToDo as any,
        creatorId: userId,
        assignedToId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedTask = {
        ...existingTask,
        title: 'Updated Title'
      };

      // Mock the repository methods
      const taskRepositoryMock = (taskService as any).taskRepository;
      taskRepositoryMock.findById.mockResolvedValue(existingTask);
      taskRepositoryMock.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(taskId, updateData, userId);

      expect(result).toEqual(updatedTask);
      expect(taskRepositoryMock.findById).toHaveBeenCalledWith(taskId);
      expect(taskRepositoryMock.update).toHaveBeenCalledWith(taskId, updateData);
    });

    it('should throw an error when task is not found', async () => {
      const taskId = 'nonexistent';
      const userId = 'user1';
      const updateData = { title: 'Updated Title' };

      // Mock the repository method
      const taskRepositoryMock = (taskService as any).taskRepository;
      taskRepositoryMock.findById.mockResolvedValue(null);

      await expect(taskService.updateTask(taskId, updateData, userId))
        .rejects
        .toThrow('Task not found');

      expect(taskRepositoryMock.findById).toHaveBeenCalledWith(taskId);
      expect(taskRepositoryMock.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task when user is authorized', async () => {
      const taskId = '1';
      const userId = 'user1';

      const existingTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: Priority.Medium as any,
        status: Status.ToDo as any,
        creatorId: userId,
        assignedToId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock the repository methods
      const taskRepositoryMock = (taskService as any).taskRepository;
      taskRepositoryMock.findById.mockResolvedValue(existingTask);
      taskRepositoryMock.delete.mockResolvedValue(existingTask);

      const result = await taskService.deleteTask(taskId, userId);

      expect(result).toEqual(existingTask);
      expect(taskRepositoryMock.findById).toHaveBeenCalledWith(taskId);
      expect(taskRepositoryMock.delete).toHaveBeenCalledWith(taskId);
    });

    it('should throw an error when user is not authorized to delete', async () => {
      const taskId = '1';
      const userId = 'user2'; // Different user

      const existingTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: Priority.Medium as any,
        status: Status.ToDo as any,
        creatorId: 'user1', // Different creator
        assignedToId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock the repository method
      const taskRepositoryMock = (taskService as any).taskRepository;
      taskRepositoryMock.findById.mockResolvedValue(existingTask);

      await expect(taskService.deleteTask(taskId, userId))
        .rejects
        .toThrow('Unauthorized to delete this task');

      expect(taskRepositoryMock.findById).toHaveBeenCalledWith(taskId);
      expect(taskRepositoryMock.delete).not.toHaveBeenCalled();
    });
  });
});