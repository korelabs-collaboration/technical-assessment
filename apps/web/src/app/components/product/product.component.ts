import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductsService } from '../../services/products.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { AsyncPipe, DatePipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Column, TableComponent } from '../table/table.component';
import { Task, TaskService } from '../../services/tasks.service';
import { TaskFormData, TaskModalComponent } from '../task-modal/task-modal.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, KeyValuePipe, TableComponent, TaskModalComponent, ConfirmationDialogComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  product$!: Observable<Product>;
  isTaskModalOpen = false;
  taskIdToDelete: string | null | undefined = null;
  productId: string | null = null;
  isConfirmationDialogOpen = false;
  taskModalInput: any = null;
  operation: string = "create";
  columns: Column[] = [
    { header: 'Title', field: 'title', type: 'string' },
    { header: 'Description', field: 'description', type: 'string' },
    { header: 'Created At', field: 'createdAt', type: 'date' },
    { header: 'Due At', field: 'dueAt', type: 'date' },
  ];

  constructor(
    private _route: ActivatedRoute,
    private _productService: ProductsService,
    private _taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    this.productId = this._route.snapshot.paramMap.get('id');
    this.product$ = this._productService.find(this.productId);
  }

  onTaskClick(task: Task) {
    this.taskModalInput = task;
    this.operation = "view";
    this.isTaskModalOpen = true;
  }

  onDeleteTask(task: Task, event: Event) {
    event.stopPropagation();
    this.taskIdToDelete = task.id;
    this.isConfirmationDialogOpen = true;
  }

  onEditTask(task: Task, event: Event) {
    event.stopPropagation();
    this.taskModalInput = task;
    this.operation = "edit";
    this.isTaskModalOpen = true;
  }

  onConfirm() {
    if (this.taskIdToDelete) {
      this.deleteTask(this.taskIdToDelete);
    }
    this.isConfirmationDialogOpen = false;
    this.taskIdToDelete = null;
  }

  onCancel() {
    this.isConfirmationDialogOpen = false;
    this.taskIdToDelete = null;
  }

  openTaskModal() {
    this.isTaskModalOpen = true;
    this.taskModalInput = null;
    this.operation = "create";
  }

  onSaveTask(task: TaskFormData) {
    if (this.operation === "create") {
      this.createTask(task);
    } else if (this.operation === "edit"){
      this.editTask(task);
    }
    this.onCloseTaskModal();
  }

  onCloseTaskModal() {
    this.isTaskModalOpen = false;
    this.taskModalInput = null;
    this.operation = "create";
  }

  createTask(task: Task) {
    this._taskService.create({
      ...task,
      productId: this.productId
    }).pipe(
      tap((response: any) => {
        this.loadProduct();
      }),
      catchError((error) => {
        return of({ error: 'Failed to create task' });
      })
    ).subscribe();
  }

  editTask(task: Task) {
    this._taskService.update({
      title: task.title,
      description: task.description,
      dueAt: task.dueAt,
      productId: this.productId
    }, task.id as string).pipe(
      tap((response: any) => {
        this.loadProduct();
      }),
      catchError((error) => {
        return of({ error: 'Failed to update task' });
      })
    ).subscribe();
  }

  deleteTask(taskId: string) {
    this._taskService.delete(taskId).pipe(
      tap((response: any) => {
        this.loadProduct();
      }),
      catchError((error) => {
        return of({ error: 'Failed to delete task' });
      })
    ).subscribe();
  }
}
