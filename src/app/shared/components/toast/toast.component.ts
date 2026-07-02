import { Component, computed } from '@angular/core';

import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-toast',
    imports: [],
    template: `
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      @for (toast of toasts(); track toast.id) {
        <div
          [class]="toastClass(toast.type)"
          class="flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg
                 animate-fade-up min-w-64 max-w-80">
          <span class="text-xl flex-shrink-0">{{ toast.icon }}</span>
          <p class="text-sm font-medium flex-1">{{ toast.message }}</p>
          <button
            (click)="toastService.remove(toast.id)"
            class="text-current opacity-50 hover:opacity-100
                   transition-opacity ml-2 flex-shrink-0">
            ✕
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toasts = computed(() => this.toastService.toasts());

  constructor(public toastService: ToastService) {}

  toastClass(type: string): string {
    const classes: Record<string, string> = {
      success: 'bg-dark text-white border border-gold/30',
      error:   'bg-red-500 text-white',
      info:    'bg-gold text-white'
    };
    return classes[type] || classes['info'];
  }
}