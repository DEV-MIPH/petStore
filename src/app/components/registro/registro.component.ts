import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.nombre || !this.email || !this.password || !this.confirmPassword) {
      this.notificationService.warning('Por favor completa todos los campos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.notificationService.error('Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 6) {
      this.notificationService.warning('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.loading = true;
    this.authService.registro(this.nombre, this.email, this.password).subscribe({
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
        console.error('Error en registro:', error);
        this.notificationService.error('Error al registrar usuario');
      }
    });
  }
} 