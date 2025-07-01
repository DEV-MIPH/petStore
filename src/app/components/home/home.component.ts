import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { ProductosService } from '../../services/productos.service';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productos: Producto[] = [];
  loading = true;

  constructor(
    private productosService: ProductosService,
    private carritoService: CarritoService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.loading = false;
        this.notificationService.error('Error al cargar los productos');
      }
    });
  }

  agregarAlCarrito(producto: Producto): void {
    if (!this.authService.estaAutenticado()) {
      this.notificationService.warning('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    this.carritoService.agregarProducto(producto);
    this.notificationService.success('✅ Producto agregado al carrito');
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Producto+PetShop';
  }
} 