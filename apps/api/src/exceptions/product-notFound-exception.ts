import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNotFoundException extends HttpException {
  constructor(productId: string) {
    super(`Product with ID ${productId} not found`, HttpStatus.NOT_FOUND);
  }
}
