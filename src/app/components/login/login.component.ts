import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.notificationService.warning('Por favor completa todos los campos');
      return;
    }

    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.success) {
          this.notificationService.success(result.message);
          this.router.navigate(['/']);
        } else {
          this.notificationService.error(result.message);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error en login:', error);
        this.notificationService.error('Error al iniciar sesión');
      }
    });
  }
} 