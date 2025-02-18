import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export type Task = {
  id?: string;
  title: string;
  description: string;
  updatedAt?: string;
  createdAt?: string;
  dueAt: string;
  productId?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _baseUrl = `${environment.apiUrl}/tasks`;

  constructor(private _http: HttpClient) {}

  create(task: Task): Observable<Task> {
    return this._http.post<Task>(this._baseUrl, task);
  }

  findAll(): Observable<Task[]> {
    return this._http.get<Task[]>(this._baseUrl);
  }

  find(taskId: string | null): Observable<Task> {
    return this._http.get<Task>(`${this._baseUrl}/${taskId}`);
  }

  update(task: Task, taskId: string): Observable<Task> {
    return this._http.patch<Task>(`${this._baseUrl}/${taskId}`, task);
  }

  delete(id: string) {
    return this._http.delete(`${this._baseUrl}/${id}`);
  }
}
