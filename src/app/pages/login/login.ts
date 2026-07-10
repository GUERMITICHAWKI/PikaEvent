import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html'
})
export class LoginComponent {

  username = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.username().trim() || !this.password().trim()) {
      this.error.set('Veuillez remplir les deux champs.');
      return;
    }

    this.error.set('');
    this.loading.set(true);

    // On stocke temporairement les identifiants, puis on vérifie avec une vraie requête protégée
    this.authService.login(this.username().trim(), this.password());

    this.http.get('http://localhost:8080/api/orders').subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.authService.logout();
        this.error.set('Identifiant ou mot de passe incorrect.');
      }
    });
  }
}