import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;
  let productRepository: Repository<Product>;

  const mockTask = {
    id: '123',
    title: 'Test Task',
    description: 'Test Description',
    dueAt: new Date(),
    productId: '456',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct = {
    id: '456',
    name: 'Test Product',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn().mockReturnValue(mockTask),
            save: jest.fn().mockResolvedValue(mockTask),
            find: jest.fn().mockResolvedValue([mockTask]),
            findOneBy: jest.fn().mockResolvedValue(mockTask),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockProduct),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(taskRepository).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueAt: new Date().toISOString(), // Convert Date to string
        productId: '456',
      };
  
      const result = await service.create(createTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockTask]);
      expect(taskRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a task by id', async () => {
      const result = await service.findOne('123');
      expect(result).toEqual(mockTask);
      expect(taskRepository.findOneBy).toHaveBeenCalledWith({ id: '123' });
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto = { title: 'Updated Task' };
      const result = await service.update('123', updateTaskDto);
      expect(result).toEqual(mockTask);
      expect(taskRepository.save).toHaveBeenCalledWith({
        id: '123',
        ...updateTaskDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const result = await service.remove('123');
      expect(result).toEqual({ affected: 1 });
      expect(taskRepository.delete).toHaveBeenCalledWith({ id: '123' });
    });
  });
});
