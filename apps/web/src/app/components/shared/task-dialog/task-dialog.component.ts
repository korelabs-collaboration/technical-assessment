import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Task } from '../../../services/products.service';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">{{ data.task ? 'Edit Task' : 'Add New Task' }}</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <mat-form-field class="w-full">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>
        </div>
        <div class="mb-4">
          <mat-form-field class="w-full">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" required rows="3"></textarea>
          </mat-form-field>
        </div>
        <div class="mb-4">
          <mat-form-field class="w-full">
            <mat-label>Due Date</mat-label>
            <input matInput type="datetime-local" formControlName="dueAt" required>
          </mat-form-field>
        </div>
        <div class="flex justify-end gap-4">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
            {{ data.task ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class TaskDialogComponent {
  form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task; productId: string }
  ) {
    this.form = this._fb.group({
      title: [data.task?.title ?? '', Validators.required],
      description: [data.task?.description ?? '', Validators.required],
      dueAt: [data.task?.dueAt ?? '', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        ...this.form.value,
        productId: this.data.productId
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
