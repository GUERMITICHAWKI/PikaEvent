import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.html'
})
export class AdminLayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    public toastService: ToastService
  ) {}
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}