import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  private toastList = signal<Toast[]>([]);
  toasts = this.toastList.asReadonly();

  private nextId = 0;

  show(message: string, type: Toast['type'] = 'success', icon = '✓', duration = 2500): void {
    const id = this.nextId++;
    this.toastList.update(list => [...list, { id, type, message, icon }]);

    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number): void {
    this.toastList.update(list => list.filter(t => t.id !== id));
  }
}