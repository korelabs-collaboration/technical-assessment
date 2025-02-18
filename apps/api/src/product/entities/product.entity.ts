import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Task } from "../../task/entities/task.entity";
import { ProductProperty } from "./product-property.entity";
import { Expose, Transform } from 'class-transformer';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @OneToOne(() => ProductProperty, (property) => property.product, {
    cascade: true,
    eager: true
  })
  @Expose({ name: 'properties' })
  @Transform(({ value }) => (value ? value.properties : {}))
  productProperties: ProductProperty;

  @CreateDateColumn({ update: false, nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @OneToMany(() => Task, (task) => task.product, {
    eager: true
  })
  tasks: Task[];
}
