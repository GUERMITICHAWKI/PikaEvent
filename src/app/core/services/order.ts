import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private readonly apiUrl = 'http://localhost:8080/api/orders';

  private readonly _orders = signal<Order[]>([]);
  readonly orders = this._orders.asReadonly();

  constructor(private http: HttpClient) {
    this.loadOrders();
  }

  loadOrders(): void {
    this.http.get<Order[]>(this.apiUrl).subscribe({
      next: (data) => this._orders.set(
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      ),
      error: (err) => console.error('Erreur chargement commandes :', err)
    });
  }

  updateStatus(id: number, status: string) {
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, status, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(() => this.loadOrders())
    );
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadOrders())
    );
  }
}