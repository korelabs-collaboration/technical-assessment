import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface Column {
  header: string;
  field: string;
  type: string
}

@Component({
  selector: 'app-table-component',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T extends {[key: string]: any}> implements OnInit {
  @Input() showDeleteOption: boolean =  true;
  @Input() showEditOption: boolean =  true;
  @Input() columns: Column[] = [];
  @Input() data: T[] | null = null;
  @Input() noTableDataMessage: string = "No data available";

  @Output() rowClicked = new EventEmitter<T>();
  @Output() deleteClicked = new EventEmitter<{ item: T, event: Event }>();
  @Output() editClicked = new EventEmitter<{ item: T, event: Event }>();

  ngOnInit(): void {
    
  }

  onRowClick(item: T) {
    this.rowClicked.emit(item);
  }

  onDeleteClick(item: T, event: Event) {
    this.deleteClicked.emit({ item, event });
  }

  onEditClick(item: T, event: Event) {
    this.editClicked.emit({ item, event });
  }
  
}
