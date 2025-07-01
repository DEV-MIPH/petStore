import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario.model';

/**
 * Servicio de autenticación de usuarios.
 * Gestiona el login, registro, logout y el usuario actual.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Usuario actualmente autenticado */
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);
  /** Lista de usuarios registrados (simulado en memoria) */
  private usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Miguel Pereira',
      email: 'miguelpereira@gmail.com',
      password: '123456'
    }
  ];

  /**
   * Inicializa el servicio y carga el usuario desde el almacenamiento local si existe.
   */
  constructor() {
    this.cargarUsuarioDesdeStorage();
  }

  /**
   * Carga el usuario autenticado desde localStorage.
   * Si hay error, elimina el usuario guardado.
   */
  private cargarUsuarioDesdeStorage(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        this.usuarioActual.next(usuario);
      } catch (error) {
        console.error('Error al cargar usuario desde storage:', error);
        localStorage.removeItem('usuario');
      }
    }
  }

  /**
   * Realiza el login de un usuario.
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Observable con el resultado del login y el usuario autenticado (sin contraseña)
   */
  login(email: string, password: string): Observable<{ success: boolean; message: string; usuario?: Usuario }> {
    const usuario = this.usuarios.find(u => u.email === email && u.password === password);
    
    if (usuario) {
      const { password, ...usuarioSinPassword } = usuario;
      localStorage.setItem('usuario', JSON.stringify(usuarioSinPassword));
      this.usuarioActual.next(usuarioSinPassword);
      return of({ success: true, message: 'Login exitoso', usuario: usuarioSinPassword });
    } else {
      return of({ success: false, message: 'Credenciales incorrectas' });
    }
  }

  /**
   * Registra un nuevo usuario.
   * @param nombre Nombre del usuario
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Observable con el resultado del registro y el usuario registrado (sin contraseña)
   */
  registro(nombre: string, email: string, password: string): Observable<{ success: boolean; message: string; usuario?: Usuario }> {
    const usuarioExistente = this.usuarios.find(u => u.email === email);
    
    if (usuarioExistente) {
      return of({ success: false, message: 'El email ya está registrado' });
    }

    const nuevoUsuario: Usuario = {
      id: this.usuarios.length + 1,
      nombre,
      email,
      password
    };

    this.usuarios.push(nuevoUsuario);
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;
    localStorage.setItem('usuario', JSON.stringify(usuarioSinPassword));
    this.usuarioActual.next(usuarioSinPassword);
    
    return of({ success: true, message: 'Registro exitoso', usuario: usuarioSinPassword });
  }

  /**
   * Cierra la sesión del usuario actual y limpia el almacenamiento local.
   */
  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('carrito');
    this.usuarioActual.next(null);
  }

  /**
   * Obtiene el usuario actualmente autenticado como observable.
   * @returns Observable del usuario actual o null
   */
  getUsuarioActual(): Observable<Usuario | null> {
    return this.usuarioActual.asObservable();
  }

  /**
   * Indica si hay un usuario autenticado actualmente.
   * @returns true si hay usuario autenticado, false si no
   */
  estaAutenticado(): boolean {
    return this.usuarioActual.value !== null;
  }
} 