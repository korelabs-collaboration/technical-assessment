import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductsService, Task } from '../../services/products.service';
import { Observable, map } from 'rxjs';
import { AsyncPipe, DatePipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { TasksService } from '../../services/tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { TaskDialogComponent } from '../shared/task-dialog/task-dialog.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, KeyValuePipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  product$!: Observable<Product>;

  constructor(
    private _route: ActivatedRoute,
    private _service: ProductsService,
    private _tasksService: TasksService,
    private _dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    this.product$ = this._service
      .findAll()
      .pipe(
        map(
          (products: Product[]) =>
            products.find((product) => product.id === id)!,
        ),
      );
  }

  deleteTask(taskId: string, event: Event) {
    event.stopPropagation();
    
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Task Deletion',
        message: 'Are you sure you want to delete this task? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._tasksService.delete(taskId).subscribe(() => {
          const id = this._route.snapshot.paramMap.get('id');
          this.product$ = this._service.findAll().pipe(
            map((products: Product[]) => products.find((product) => product.id === id)!)
          );
        });
      }
    });
  }

  updateTask(task: Task) {
    const dialogRef = this._dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { 
        task,
        productId: task.productId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._tasksService.update(task.id, result).subscribe(() => {
          const id = this._route.snapshot.paramMap.get('id');
          this.product$ = this._service.findAll().pipe(
            map((products: Product[]) => products.find((product) => product.id === id)!)
          );
        });
      }
    });
  }

  addTask() {
    const productId = this._route.snapshot.paramMap.get('id');
    if (!productId) return;

    const dialogRef = this._dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { productId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._tasksService.create(result).subscribe(() => {
          this.product$ = this._service.findAll().pipe(
            map((products: Product[]) => products.find((product) => product.id === productId)!)
          );
        });
      }
    });
  }
}
