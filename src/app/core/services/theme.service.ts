import { Injectable, signal, effect } from '@angular/core';

const THEME_KEY = 'pika-event-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  isDark = signal<boolean>(this.loadInitial());

  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }

  private loadInitial(): boolean {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === 'dark';
      // Sinon, respecte la préférence système
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  }
}