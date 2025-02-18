import { HttpException, HttpStatus } from '@nestjs/common';

export class TaskNotFoundException extends HttpException {
  constructor(taskId: string) {
    super(`Task with ID ${taskId} not found`, HttpStatus.NOT_FOUND);
  }
}
