import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product, ProductPayload } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly apiUrl = 'http://localhost:8080/api/products';

  private readonly _products = signal<Product[]>([]);
  readonly products = this._products.asReadonly();

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (data) => this._products.set(data),
      error: (err) => console.error('Erreur chargement produits :', err)
    });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(payload: ProductPayload): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, payload).pipe(
      tap(() => this.loadProducts())
    );
  }

  update(id: number, payload: ProductPayload): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, payload).pipe(
      tap(() => this.loadProducts())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadProducts())
    );
  }
}