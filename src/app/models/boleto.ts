import { CategoriaTurista } from '../util/categoria-turista';

export class Boleto {
  _id!: number; // Usaremos un timestamp simple para el ID por ahora
  dni!: number;
  precio!: number; // Precio base sin descuento
  categoria!: CategoriaTurista;
  fechaCompra!: Date;
  email!: string;
  precioTotal!: number; // Precio final con descuento aplicado

  constructor() {
   
  }

  // Método para calcular el precio total con descuento
  calcularPrecioTotal(): number {
    let descuento = 0;
    switch (this.categoria) {
      case CategoriaTurista.Menor:
        descuento = 0.35; // 35%
        break;
      case CategoriaTurista.Jubilado:
        descuento = 0.5; // 50%
        break;
      case CategoriaTurista.Adulto:
      default:
        descuento = 0; // 0%
        break;
    }
    return this.precio * (1 - descuento);
  }

  // Método para obtener el nombre de la categoría (opcional, pero útil)
  getCategoriaNombre(): string {
    switch (this.categoria) {
      case CategoriaTurista.Menor:
        return 'Menor';
      case CategoriaTurista.Adulto:
        return 'Adulto';
      case CategoriaTurista.Jubilado:
        return 'Jubilado';
      default:
        return 'Desconocido';
    }
  }
}
