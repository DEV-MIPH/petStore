import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  // Reemplaza esta URL por la de tu JSON en GitHub Pages
  private apiUrl = 'https://dev-miph.github.io/data-page/data.json';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProductoPorId(id: number): Observable<Producto | undefined> {
    return this.getProductos().pipe(
      map(productos => productos.find(p => p.id === id))
    );
  }
} 