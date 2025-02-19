import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private _repository: Repository<Product>,
    @InjectRepository(Task) private _taskRepository: Repository<Task>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this._repository.create(createProductDto);
    return this._repository.save(product);
  }

  async findAll() {
    return this._repository.find({
      relations: ['tasks'],
    });
  }

  findOne(id: string) {
    return this._repository.findOne({
      where: { id },
      relations: ['tasks'],
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this._repository.findOne({ where: { id } });
    if (!product) {
      throw new Error('Product not found');
    }

    Object.assign(product, updateProductDto);
    return this._repository.save(product);
  }

  remove(id: string) {
    return this._repository.delete({ id });
  }
}
