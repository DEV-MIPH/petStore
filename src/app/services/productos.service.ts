import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private productos: Producto[] = [
    {
      id: 1,
      nombre: 'Alimento Premium para Perros',
      precio: 10000,
      imagen: 'assets/img/Alimento Premium para Perros.jpg',
      descripcion: 'Alimento balanceado con proteínas de alta calidad'
    },
    {
      id: 2,
      nombre: 'Juguete Interactivo para Gatos',
      precio: 5000,
      imagen: 'assets/img/Juguete Interactivo para Gatos.jpg',
      descripcion: 'Juguete con plumas y sonidos para estimular a tu gato'
    },
    {
      id: 3,
      nombre: 'Collar Ajustable para Perro',
      precio: 7000,
      imagen: 'assets/img/Collar Ajustable para Perro.jpg',
      descripcion: 'Collar cómodo y seguro con hebilla de liberación rápida'
    },
    {
      id: 4,
      nombre: 'Arena Sanitaria para Gatos',
      precio: 8000,
      imagen: 'assets/img/Arena Sanitaria para Gatos.jpg',
      descripcion: 'Arena aglomerante con control de olores'
    },
    {
      id: 5,
      nombre: 'Cama para Mascotas',
      precio: 15000,
      imagen: 'assets/img/Cama para Mascotas.jpg',
      descripcion: 'Cama suave y cómoda para perros y gatos'
    },
    {
      id: 6,
      nombre: 'Shampoo para Mascotas',
      precio: 6000,
      imagen: 'assets/img/Shampoo para Mascotas.jpg',
      descripcion: 'Shampoo hipoalergénico con pH balanceado'
    }
  ];

  constructor() { }

  getProductos(): Observable<Producto[]> {
    return of(this.productos);
  }

  getProductoPorId(id: number): Observable<Producto | undefined> {
    const producto = this.productos.find(p => p.id === id);
    return of(producto);
  }
} 