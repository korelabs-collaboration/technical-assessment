import { DatePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

export type TaskFormData = {
  title: string;
  description: string;
  dueAt: string;
  id?: string;
};

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  providers: [DatePipe],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent {
  @Input() isOpen = false;
  @Input() operation: any;
  @Input() task: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveTask = new EventEmitter<TaskFormData>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueAt: ['', Validators.required]
    });
  }

  ngOnInit() {
   
  }

  ngOnChanges(changes: SimpleChanges) {
    this.taskForm.enable();
    if (this.operation === 'edit' || this.operation === 'view') {
      this.taskForm.patchValue( {
        ...this.task,
        dueAt: this.datePipe.transform(this.task.dueAt, 'YYYY-MM-dd')
      });

      if(this.operation === 'view') {
        this.taskForm.disable();
      }
    } 
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.saveTask.emit( {
        ...this.taskForm.value,
        ...((this.task && this.task.id) ? { id: this.task.id } : {})
      });
      this.taskForm.reset();
    }
  }

  onClose() {
    this.closeModal.emit();
    this.taskForm.reset();
  }

}
