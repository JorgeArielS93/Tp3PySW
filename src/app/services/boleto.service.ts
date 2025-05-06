import { Injectable } from '@angular/core';
import { Boleto } from '../models/boleto';
import { CategoriaTurista } from '../util/categoria-turista';

@Injectable({
  providedIn: 'root'
})
export class BoletoService {

  // Array para simular el almacenamiento de boletos
  private boletos: Array<Boleto>;

  constructor() {
    // Inicializamos el array
    this.boletos = new Array<Boleto>();

    // Opcional: Inicializamos el array con algunos datos de ejemplo
    // Similar a como se hace con 'mensajes' en la documentación
    const boleto1 = new Boleto();
    boleto1._id = Date.now() + 1;
    boleto1.dni = 11111111;
    boleto1.precio = 100;
    boleto1.categoria = CategoriaTurista.Adulto;
    boleto1.fechaCompra = new Date();
    boleto1.email = 'adulto.ejemplo@mail.com';
    boleto1.precioTotal = boleto1.calcularPrecioTotal(); // Calcula el precio total

    const boleto2 = new Boleto();
    boleto2._id = Date.now() + 2;
    boleto2.dni = 22222222;
    boleto2.precio = 100;
    boleto2.categoria = CategoriaTurista.Menor;
    boleto2.fechaCompra = new Date();
    boleto2.email = 'menor.ejemplo@mail.com';
    boleto2.precioTotal = boleto2.calcularPrecioTotal(); // Calcula el precio total

    this.boletos.push(boleto1);
    this.boletos.push(boleto2);

    console.log('Boletos de ejemplo inicializados:', this.boletos); // Para verificar
  }

  // --- Métodos CRUD ---

  // CREATE: Agrega un nuevo boleto
  addBoleto(boleto: Boleto): void {
    // Asigna un ID único (similar a getIdDisponible en el ejemplo de Mensaje)
    // Aunque aquí usamos timestamp, en el ejemplo se calcula el max + 1
    // Para simplificar y seguir el ejemplo general de ID simple, usamos timestamp.
    // Si quieres replicar exactamente getIdDisponible, tendrías que implementarlo.
    boleto._id = Date.now();

    // Calcula el precio total antes de agregar
    boleto.precioTotal = boleto.calcularPrecioTotal();

    // Agrega el boleto al array
    this.boletos.push(boleto);
    console.log('Boleto agregado:', boleto);
  }

  // READ: Retorna un array con todos los boletos (similar a getMensajes)
  getAllBoletos(): Array<Boleto> {
    // Retornamos una copia del array para evitar modificaciones externas
    return [...this.boletos];
  }

  // READ: Obtiene un boleto por su ID (similar a getMensaje)
  getBoleto(id: number): Boleto | undefined {
    // Busca el boleto en el array por su _id
    // La documentación usa findIndex y luego accede por índice,
    // find() es un poco más directo si solo necesitas el objeto.
    return this.boletos.find(b => b._id === id);
  }

  // UPDATE: Actualiza un boleto existente (similar a updateMensaje, aunque no implementado en el PDF)
  updateBoleto(updatedBoleto: Boleto): boolean {
    // Busca el índice del boleto
    const index = this.boletos.findIndex(b => b._id === updatedBoleto._id);

    // Si el boleto existe
    if (index !== -1) {
      // Recalcula el precio total por si hubo cambios
      updatedBoleto.precioTotal = updatedBoleto.calcularPrecioTotal();
      // Reemplaza el boleto en el array
      this.boletos[index] = updatedBoleto;
      console.log('Boleto actualizado:', updatedBoleto);
      return true; // Indica éxito
    }

    console.warn('No se encontró el boleto con ID para actualizar:', updatedBoleto._id);
    return false; // Indica que no se encontró el boleto
  }

  // DELETE: Elimina un boleto por su ID (similar a deleteMensaje)
  deleteBoleto(id: number): boolean {
    // Encuentra la longitud inicial
    const initialLength = this.boletos.length;
    // Filtra el array para remover el boleto con el ID dado
    this.boletos = this.boletos.filter(b => b._id !== id);

    // Comprueba si la longitud cambió
    if (this.boletos.length < initialLength) {
      console.log('Boleto eliminado con ID:', id);
      return true; // Indica éxito
    }

    console.warn('No se encontró el boleto con ID para eliminar:', id);
    return false; // Indica que no se encontró el boleto
  }

}
