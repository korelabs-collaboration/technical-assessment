import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">{{ data.title }}</h2>
      <p class="mb-6">{{ data.message }}</p>
      <div class="flex justify-end gap-4">
        <button mat-button (click)="onNoClick()">Cancel</button>
        <button mat-raised-button color="warn" (click)="onYesClick()">Delete</button>
      </div>
    </div>
  `,
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
