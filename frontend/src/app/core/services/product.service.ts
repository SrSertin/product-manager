import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DashboardStats, PageResponse, Product, ProductFilter, ProductRequest } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(filter: ProductFilter) {
    let params = new HttpParams()
      .set('page', filter.page)
      .set('size', filter.size)
      .set('sort', filter.sort);
    if (filter.search)   params = params.set('search', filter.search);
    if (filter.category) params = params.set('category', filter.category);
    if (filter.active !== undefined) params = params.set('active', filter.active);
    return this.http.get<PageResponse<Product>>(this.base, { params });
  }

  getById(id: number) {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  getDashboard() {
    return this.http.get<DashboardStats>(`${this.base}/dashboard`);
  }

  create(data: ProductRequest) {
    return this.http.post<Product>(this.base, data);
  }

  update(id: number, data: ProductRequest) {
    return this.http.put<Product>(`${this.base}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
