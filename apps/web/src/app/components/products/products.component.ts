import { Component, OnInit } from '@angular/core';
import { Product, ProductsService } from '../../services/products.service';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, AsyncPipe, DatePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  products$!: Observable<Product[]>;

  constructor(
    private _service: ProductsService,
    private _router: Router,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.products$ = this._service.findAll();
  }

  showProduct(id: string) {
    this._router.navigate(['products', id]);
  }

  async deleteProduct(id: string, event: Event) {
    event.stopPropagation();
    
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this product? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._service.delete(id).subscribe(() => this.loadProducts());
      }
    });
  }
}
