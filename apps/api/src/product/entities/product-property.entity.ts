import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_properties')
export class ProductProperty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  key: string;

  @Column('text')
  value: string;

  @ManyToOne(() => Product, (product) => product.properties)
  product: Product;
}