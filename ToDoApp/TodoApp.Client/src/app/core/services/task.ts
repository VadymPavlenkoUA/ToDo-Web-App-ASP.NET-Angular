import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Task,
  TaskListResponse,
  CreateTaskRequest,
  UpdateTaskRequest
} from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly apiUrl = `${environment.apiUrl}/Tasks`;

  constructor(private http: HttpClient) {}

  getTasks(
    search?: string,
    categoryId?: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<TaskListResponse> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (search) {
      params = params.set('search', search);
    }

    if (categoryId !== undefined && categoryId !== null) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<TaskListResponse>(
      this.apiUrl,
      { params }
    );
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(
      `${this.apiUrl}/${id}`
    );
  }

  create(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(
      this.apiUrl,
      request
    );
  }

  update(
    id: number,
    request: UpdateTaskRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}