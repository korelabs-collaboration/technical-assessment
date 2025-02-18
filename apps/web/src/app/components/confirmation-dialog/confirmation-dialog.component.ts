import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  @Input() isDialogOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  openDialog() {
    this.isDialogOpen = true;
  }

  confirmAction() {
    this.confirm.emit();
    this.isDialogOpen = false;
  }

  cancelAction() {
    this.cancel.emit();
    this.isDialogOpen = false;
  }
}