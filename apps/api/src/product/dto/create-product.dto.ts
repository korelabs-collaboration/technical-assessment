import { IsString, IsOptional, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsObject()
  @IsOptional()
  properties?: Record<string, any>;
}
