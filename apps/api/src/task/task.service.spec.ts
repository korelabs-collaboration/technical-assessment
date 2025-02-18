import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../product/entities/product.entity';
import { TaskService } from './task.service';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProductNotFoundException } from '../exceptions/product-notFound-exception';

describe('TaskService', () => {
  let service: TaskService;
  let productRepository: Repository<Product>;
  let taskRepository: Repository<Task>;

  const taskDto: CreateTaskDto = {
    productId: 'productId',
    title: 'task-title',
    description: 'task-description',
    dueAt: '2025-02-17T19:51:00.623Z',
  };

  const product = {
    id: 'product-id',
    name: 'product-name',
    createdAt: new Date(),
    tasks: []
  };

  const task = {
    id: 'task-id',
    title: 'task-title',
    description: 'task-description',
    dueAt: new Date(taskDto.dueAt),
    createdAt: new Date(),
    product,
  };

  beforeEach(async () => {
    const productRepositoryToken = getRepositoryToken(Product);
    const taskRepositoryToken = getRepositoryToken(Task);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: productRepositoryToken,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: taskRepositoryToken,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    productRepository = module.get<Repository<Product>>(productRepositoryToken);
    taskRepository = module.get<Repository<Task>>(taskRepositoryToken);
  });

  it('should be defined', () => {
    // Fixed by proper Testing module configuration
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.save with the createTaskDto', async () => {
      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValue(product as Product);
      jest.spyOn(taskRepository, 'create').mockReturnValue(task as Task);
      await service.create(taskDto);
      expect(taskRepository.save).toHaveBeenCalledWith(task);
    });

    it('should not call repository.save with the createTaskDto if invalid productId', async () => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(taskRepository, 'create').mockReturnValue(task as Task);
      await expect(service.create(taskDto)).rejects.toThrow(
        ProductNotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should call repository.find', () => {
      service.findAll();
      expect(taskRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call repository.findOneBy with the id', () => {
      const id = '123';
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockResolvedValue(task as Task);
      service.findOne(id);
      expect(taskRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('update', () => {
    it('should call repository.save with the updateTaskDto', async () => {
      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValue(product as Product);
      jest.spyOn(taskRepository, 'create').mockReturnValue(task as Task);
      await service.update("123",taskDto);
      expect(taskRepository.save).toHaveBeenCalledWith(task);
    });

    it('should not call repository.save with the updateTaskDto if invalid productId', async () => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(taskRepository, 'create').mockReturnValue(task as Task);
      await expect(service.update("123", taskDto)).rejects.toThrow(
        ProductNotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should call repository.delete with the id', async () => {
      const id = '123';
      const deletedresult = {
        affected: 1,
        raw: []
      }
      jest.spyOn(taskRepository, 'delete').mockResolvedValue(deletedresult);
      await service.remove(id);
      expect(taskRepository.delete).toHaveBeenCalledWith({ id });
    });
  });

});
