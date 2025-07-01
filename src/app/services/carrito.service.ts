import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarritoItem } from '../models/carrito-item.model';
import { Producto } from '../models/producto.model';
import { ProductosService } from './productos.service';

/**
 * Servicio para la gestión del carrito de compras.
 * Permite agregar, remover, actualizar y limpiar productos del carrito.
 */
@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  /** Lista de items en el carrito (observable) */
  private carritoItems = new BehaviorSubject<CarritoItem[]>([]);

  /**
   * Inicializa el servicio y carga el carrito desde el almacenamiento local si existe.
   * @param productosService Servicio de productos para obtener detalles de productos
   */
  constructor(private productosService: ProductosService) {
    this.cargarCarritoDesdeStorage();
  }

  /**
   * Carga el carrito desde localStorage y reconstruye los items.
   */
  private cargarCarritoDesdeStorage(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        const ids = JSON.parse(carritoGuardado);
        this.cargarProductosPorIds(ids);
      } catch (error) {
        console.error('Error al cargar carrito desde storage:', error);
        localStorage.removeItem('carrito');
      }
    }
  }

  /**
   * Carga los productos por sus IDs y actualiza el carrito.
   * @param ids Array de IDs de productos
   */
  private cargarProductosPorIds(ids: number[]): void {
    const items: CarritoItem[] = [];
    const contador: { [key: number]: number } = {};

    // Contar ocurrencias de cada ID
    ids.forEach(id => {
      contador[id] = (contador[id] || 0) + 1;
    });

    // Crear items del carrito
    Object.keys(contador).forEach(idStr => {
      const id = parseInt(idStr);
      this.productosService.getProductoPorId(id).subscribe(producto => {
        if (producto) {
          items.push({
            producto,
            cantidad: contador[id]
          });
        }
      });
    });

    this.carritoItems.next(items);
  }

  /**
   * Agrega un producto al carrito. Si ya existe, incrementa la cantidad.
   * @param producto Producto a agregar
   */
  agregarProducto(producto: Producto): void {
    const items = this.carritoItems.value;
    const itemExistente = items.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad += 1;
      this.carritoItems.next([...items]);
    } else {
      this.carritoItems.next([...items, { producto, cantidad: 1 }]);
    }

    this.guardarCarritoEnStorage();
  }

  /**
   * Remueve un producto del carrito por su ID.
   * @param productoId ID del producto a remover
   */
  removerProducto(productoId: number): void {
    const items = this.carritoItems.value.filter(item => item.producto.id !== productoId);
    this.carritoItems.next(items);
    this.guardarCarritoEnStorage();
  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * @param productoId ID del producto
   * @param cantidad Nueva cantidad
   */
  actualizarCantidad(productoId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.removerProducto(productoId);
      return;
    }

    const items = this.carritoItems.value.map(item => 
      item.producto.id === productoId 
        ? { ...item, cantidad } 
        : item
    );
    this.carritoItems.next(items);
    this.guardarCarritoEnStorage();
  }

  /**
   * Limpia todos los productos del carrito.
   */
  limpiarCarrito(): void {
    this.carritoItems.next([]);
    localStorage.removeItem('carrito');
  }

  /**
   * Obtiene los items actuales del carrito como observable.
   * @returns Observable de CarritoItem[]
   */
  getCarritoItems(): Observable<CarritoItem[]> {
    return this.carritoItems.asObservable();
  }

  /**
   * Obtiene el total del carrito (precio * cantidad) como observable.
   * @returns Observable del total
   */
  getTotal(): Observable<number> {
    return this.carritoItems.pipe(
      map(items => items.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0))
    );
  }

  /**
   * Obtiene la cantidad total de productos en el carrito como observable.
   * @returns Observable de la cantidad total
   */
  getCantidadTotal(): Observable<number> {
    return this.carritoItems.pipe(
      map(items => items.reduce((total, item) => total + item.cantidad, 0))
    );
  }

  /**
   * Guarda el carrito actual en localStorage.
   */
  private guardarCarritoEnStorage(): void {
    const items = this.carritoItems.value;
    const ids: number[] = [];
    
    items.forEach(item => {
      for (let i = 0; i < item.cantidad; i++) {
        ids.push(item.producto.id);
      }
    });

    localStorage.setItem('carrito', JSON.stringify(ids));
  }
} 