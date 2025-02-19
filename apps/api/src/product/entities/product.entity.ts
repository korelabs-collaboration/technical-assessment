import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @CreateDateColumn({ update: false, nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @OneToMany(() => Task, (task) => task.product, { cascade: true, onDelete: 'CASCADE' })
  tasks: Task[];

  @Column('json', { nullable: true })
  properties: Record<string, any>;
}
