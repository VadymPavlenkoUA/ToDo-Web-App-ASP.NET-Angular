import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest} from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl = `${environment.apiUrl}/Categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(
      this.apiUrl
    );
  }

  getCategory(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  createCategory(
    request: CreateCategoryRequest
  ): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(
      this.apiUrl,
      request
    );
  }

  updateCategory(
    id: number,
    request: UpdateCategoryRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}