import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Task } from './tasks.service';

export type Product = {
  id: string;
  name: string;
  updatedAt: string;
  properties: Record<string, any>;
  tasks: Task[];
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private _baseUrl = `${environment.apiUrl}/products`;

  constructor(private _http: HttpClient) {}

  findAll(): Observable<Product[]> {
    return this._http.get<Product[]>(this._baseUrl);
  }

  find(productId: string | null): Observable<Product> {
    return this._http.get<Product>(`${this._baseUrl}/${productId}`);
  }

  delete(id: string) {
    return this._http.delete(`${this._baseUrl}/${id}`);
  }
}
