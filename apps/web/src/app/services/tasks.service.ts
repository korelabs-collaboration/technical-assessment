import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Task } from './products.service';

export interface CreateTaskDto {
  title: string;
  description: string;
  dueAt: string;
  productId: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private _baseUrl = `${environment.apiUrl}/tasks`;

  constructor(private _http: HttpClient) {}

  create(createTaskDto: CreateTaskDto): Observable<Task> {
    return this._http.post<Task>(this._baseUrl, createTaskDto);
  }

  update(id: string, updateTaskDto: UpdateTaskDto): Observable<Task> {
    return this._http.patch<Task>(`${this._baseUrl}/${id}`, updateTaskDto);
  }

  delete(id: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/${id}`);
  }
}
