import { TestBed } from '@angular/core/testing';

class MathService {
  sumar(a: number, b: number): number {
    return a + b;
  }

  restar(a: number, b: number): number {
    return a - b;
  }

  multiplicar(a: number, b: number): number {
    return a * b;
  }

  dividir(a: number, b: number): number {
    if (b === 0) {
      throw new Error('No se puede dividir por cero');
    }
    return a / b;
  }
}

describe('MathService', () => {
  let service: MathService;

  beforeEach(() => {
    service = new MathService();
  });

  describe('sumar', () => {
    it('debería sumar dos números positivos correctamente', () => {
      const resultado = service.sumar(5, 3);
      expect(resultado).toBe(8);
    });

    it('debería sumar un número positivo y uno negativo', () => {
      const resultado = service.sumar(10, -3);
      expect(resultado).toBe(7);
    });

    it('debería sumar dos números negativos', () => {
      const resultado = service.sumar(-5, -3);
      expect(resultado).toBe(-8);
    });

    it('debería sumar cero con cualquier número', () => {
      const resultado = service.sumar(15, 0);
      expect(resultado).toBe(15);
    });

    it('debería sumar números decimales', () => {
      const resultado = service.sumar(3.5, 2.5);
      expect(resultado).toBe(6);
    });
  });

  describe('restar', () => {
    it('debería restar dos números correctamente', () => {
      const resultado = service.restar(10, 4);
      expect(resultado).toBe(6);
    });
  });

  describe('multiplicar', () => {
    it('debería multiplicar dos números correctamente', () => {
      const resultado = service.multiplicar(6, 7);
      expect(resultado).toBe(42);
    });
  });

  describe('dividir', () => {
    it('debería dividir dos números correctamente', () => {
      const resultado = service.dividir(15, 3);
      expect(resultado).toBe(5);
    });

    it('debería lanzar error al dividir por cero', () => {
      expect(() => service.dividir(10, 0)).toThrowError('No se puede dividir por cero');
    });
  });
}); 