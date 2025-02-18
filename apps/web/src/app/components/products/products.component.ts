import { Component, OnInit } from '@angular/core';
import { Product, ProductsService } from '../../services/products.service';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Column, TableComponent } from '../table/table.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, AsyncPipe, DatePipe, ConfirmationDialogComponent, TableComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  products$!: Observable<Product[]>;
  isConfirmationDialogOpen = false;
  productIdToDelete: string | null = null;

  columns: Column[] = [
    { header: 'ID', field: 'id', type: 'string' },
    { header: 'Name', field: 'name', type: 'string' },
    { header: 'Updated At', field: 'updatedAt', type: 'date' },
  ];

  constructor(
    private _service: ProductsService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.products$ = this._service.findAll();
  }

  onProductClick(product: Product) {
    this._router.navigate(['products', product.id]);
  }

  async deleteProduct(product: Product, event: Event) {
    event.stopPropagation();
    this.productIdToDelete = product.id;
    this.isConfirmationDialogOpen = true;
  }

  onConfirm() {
    if (this.productIdToDelete) {
      this._service.delete(this.productIdToDelete).subscribe(() => this.loadProducts())
    }
    this.isConfirmationDialogOpen = false;
  }

  onCancel() {
    this.isConfirmationDialogOpen = false;
    this.productIdToDelete = null;
  }
}
