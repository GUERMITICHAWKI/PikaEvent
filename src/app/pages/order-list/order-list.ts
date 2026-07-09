import { Component, computed, signal } from '@angular/core';
import { OrderService } from '../../core/services/order';
import { Order } from '../../core/models/order.model';

const STATUS_OPTIONS = ['EN_ATTENTE', 'CONFIRMEE', 'LIVREE', 'ANNULEE'];

const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  CONFIRMEE: 'Confirmée',
  LIVREE: 'Livrée',
  ANNULEE: 'Annulée'
};

const STATUS_COLORS: Record<string, string> = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-700',
  CONFIRMEE: 'bg-blue-100 text-blue-700',
  LIVREE: 'bg-green-100 text-green-700',
  ANNULEE: 'bg-red-100 text-red-700'
};

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [],
  templateUrl: './order-list.html'
})
export class OrderListComponent {

  orders = computed(() => this.orderService.orders());
  expandedId = signal<number | null>(null);
  previewImage = signal<string | null>(null);

  statusOptions = STATUS_OPTIONS;
  statusLabels = STATUS_LABELS;
  statusColors = STATUS_COLORS;

  constructor(private orderService: OrderService) {}

  toggleExpand(order: Order) {
    this.expandedId.set(this.expandedId() === order.id ? null : order.id);
  }

  openPreview(url: string | undefined, event: Event) {
    event.stopPropagation();
    if (url) this.previewImage.set(url);
  }

  closePreview() {
    this.previewImage.set(null);
  }

  changeStatus(order: Order, newStatus: string) {
    this.orderService.updateStatus(order.id, newStatus).subscribe({
      error: (err) => alert('Erreur lors du changement de statut : ' + err.message)
    });
  }

  deleteOrder(order: Order) {
    if (!confirm(`Supprimer la commande #${order.id} ? Cette action est irréversible.`)) return;
    this.orderService.delete(order.id).subscribe({
      error: (err) => alert('Erreur lors de la suppression : ' + err.message)
    });
  }

  formatPrice(millimes: number): string {
    return (millimes / 1000).toFixed(3) + ' ت.د';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}