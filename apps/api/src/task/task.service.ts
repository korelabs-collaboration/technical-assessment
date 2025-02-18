import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { TaskNotFoundException } from '../exceptions/task-notFound-exception';
import { ProductNotFoundException } from '../exceptions/product-notFound-exception';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private _repository: Repository<Task>,
    @InjectRepository(Product) private _productRepository: Repository<Product>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    // Fixed by fetching product by product id and supplying product entity with task entity
    let product: Product | undefined;

    if (createTaskDto.productId) {
      product = await this.getProductById(createTaskDto.productId);
    }

    const task: Task = this._repository.create({
      ...createTaskDto,
      product,
    });

    return this._repository.save(task);
  }

  findAll() {
    return this._repository.find();
  }

  async findOne(id: string) {
    const task = await this._repository.findOneBy({ id });

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    return task
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    let product: Product | undefined;

    if (updateTaskDto.productId) {
      product = await this.getProductById(updateTaskDto.productId);
    }

    const task: Task = this._repository.create({
      id,
      ...updateTaskDto,
      product,
    });

    return this._repository.save(task);
  }

  async remove(id: string) {
    const deleteResult = await this._repository.delete({ id });
    if(deleteResult.affected === 0) {
      throw new TaskNotFoundException(id);
    }

    return {
      deleted: true
    }
  }

  async getProductById(productId: string) : Promise<Product> {
    const product = await this._productRepository.findOneBy({
      id: productId,
    });

    if (!product) {
      throw new ProductNotFoundException(productId);
    }

    return product;
  }
}
