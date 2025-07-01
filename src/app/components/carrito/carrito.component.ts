import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoItem } from '../../models/carrito-item.model';
import { CarritoService } from '../../services/carrito.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carritoItems: CarritoItem[] = [];
  total: number = 0;
  loading: boolean = true;

  constructor(
    private carritoService: CarritoService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.carritoService.getCarritoItems().subscribe(items => {
      this.carritoItems = items;
      this.loading = false;
    });

    this.carritoService.getTotal().subscribe(total => {
      this.total = total;
    });
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    this.carritoService.actualizarCantidad(productoId, cantidad);
  }

  removerProducto(productoId: number): void {
    this.carritoService.removerProducto(productoId);
    this.notificationService.success('Producto removido del carrito');
  }

  limpiarCarrito(): void {
    this.carritoService.limpiarCarrito();
    this.notificationService.info('Carrito limpiado');
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/80x80/4CAF50/FFFFFF?text=Producto';
  }
} 