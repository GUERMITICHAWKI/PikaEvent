import { Injectable, signal } from '@angular/core';

const AUTH_STORAGE_KEY = 'pika-admin-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly _credentials = signal<string | null>(this.loadFromStorage());
  readonly isLoggedIn = signal<boolean>(this._credentials() !== null);

  login(username: string, password: string): void {
    const encoded = btoa(`${username}:${password}`);
    this._credentials.set(encoded);
    this.isLoggedIn.set(true);
    sessionStorage.setItem(AUTH_STORAGE_KEY, encoded);
  }

  logout(): void {
    this._credentials.set(null);
    this.isLoggedIn.set(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }

  getAuthHeader(): string | null {
    const creds = this._credentials();
    return creds ? `Basic ${creds}` : null;
  }

  private loadFromStorage(): string | null {
    return sessionStorage.getItem(AUTH_STORAGE_KEY);
  }
}