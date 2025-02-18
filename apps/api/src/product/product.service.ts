import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';
import { ProductNotFoundException } from '../exceptions/product-notFound-exception';
import { ProductProperty } from './entities/product-property.entity';

type ProductWithTasks = Product & { tasks?: Task[] };

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private _repository: Repository<Product>
  ) {}

  create(createProductDto: CreateProductDto) {

    const product: Product = this._repository.create({
      name: createProductDto.name,
      productProperties: this.getProductProprty(createProductDto.properties)
    });

    return this._repository.save(product);
  }

  async findAll() {
    const products: ProductWithTasks[] = await this._repository.find();
    return products;
  }

  async findOne(id: string) {
    const product = await this._repository.findOneBy({ id });

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const product: Product = this._repository.create({
      id,
      name: updateProductDto.name,
      productProperties: this.getProductProprty(updateProductDto.properties)
    });

    return this._repository.save(product);
  }

  async remove(id: string) {
    const deleteResult = await this._repository.delete({ id });
    if(deleteResult.affected === 0) {
      throw new ProductNotFoundException(id);
    }

    return {
      deleted: true
    }
  }

  getProductProprty(properties: Record<string, any>): ProductProperty {
    let productProperty: ProductProperty = new ProductProperty();

    if (properties) {
      productProperty.properties = properties;
    }
    return productProperty;
  }
}
