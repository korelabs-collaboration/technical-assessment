import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  dueAt: Date;

  @Column('uuid')
  productId: string;

  @ManyToOne(() => Product, (product) => product.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn({ update: false, nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
