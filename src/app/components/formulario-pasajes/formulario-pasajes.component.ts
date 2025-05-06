// Importaciones necesarias para Componente, Ciclo de Vida, Formularios y Rutas
import { Component, OnInit } from '@angular/core'; // Ya no necesitamos AfterViewInit, OnDestroy
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Importaciones de tus modelos y servicios
import { CategoriaTurista } from '../../util/categoria-turista';
import { Boleto } from '../../models/boleto';
import { BoletoService } from '../../services/boleto.service';

// Importaciones comunes de Angular (Pipes, etc.)
import { CommonModule, CurrencyPipe } from '@angular/common';

// Ya no necesitamos importar DataTablesModule, DataTableDirective, Config, Subject, DataTables

@Component({
  selector: 'app-formulario-pasajes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    // Ya no necesitamos DataTablesModule aquí
    CommonModule // Contiene pipes como DatePipe, CurrencyPipe
  ],
  templateUrl: './formulario-pasajes.component.html',
  styleUrls: ['./formulario-pasajes.component.css'] // Asegúrate que sea styleUrls (array)
})
export class FormularioPasajesComponent implements OnInit {

  // --- Propiedades del Componente ---

  listaBoletos: Array<Boleto> = []; // Propiedad para almacenar los boletos para la tabla
  accion: string = "new"; // 'new' para crear, 'update' para editar
  boletoActual: Boleto = new Boleto(); // Objeto para el formulario (crear o editar)

  // Propiedad para almacenar el resumen de ventas
// *** CORRECCIÓN AQUÍ: Definimos explícitamente las propiedades esperadas ***
resumenVentas: {
  Adulto: number;
  Menor: number;
  Jubilado: number;
  totalGeneral: number;
} = { // Inicializamos con valores por defecto
  Adulto: 0,
  Menor: 0,
  Jubilado: 0,
  totalGeneral: 0
};

  // Define tu formulario reactivo (Group de controles de formulario)
  boletoForm: FormGroup = new FormGroup({
    _id: new FormControl(0),
    dni: new FormControl('', Validators.required),
    precio: new FormControl(null, [Validators.required, Validators.min(0)]),
    categoria: new FormControl(null, Validators.required), // Usamos null para que la opción por defecto funcione
    fechaCompra: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    precioTotal: new FormControl(0)
  });


  // --- Constructor: Inyección de Dependencias ---
  constructor(
    private boletoService: BoletoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }


  // --- Métodos del Ciclo de Vida ---

  ngOnInit(): void {
    // Carga los boletos iniciales y calcula el resumen
    this.cargarBoletos();
    this.calcularResumenVentas(); // Calcula el resumen después de cargar los datos iniciales

    // Suscripción a los parámetros de la ruta
     this.activatedRoute.params.subscribe(params => {
      const idBoleto = Number(params['id']);
      console.log('ID desde la ruta:', idBoleto);

      if (isNaN(idBoleto) || idBoleto === 0) {
        this.accion = "new";
        console.log('Modo: Nuevo Boleto');
        this.iniciarFormularioNuevo();
      } else {
        this.accion = "update";
        console.log('Modo: Editar Boleto con ID:', idBoleto);
        this.cargarBoletoParaEditar(idBoleto);
      }
    });
  }

  // --- Métodos para la Lógica del Formulario ---

  iniciarFormularioNuevo(): void {
    this.boletoActual = new Boleto();
    this.boletoActual.fechaCompra = new Date();
    this.boletoForm.reset({
        _id: 0,
        fechaCompra: this.formatDate(this.boletoActual.fechaCompra)
    });
  }

  cargarBoletoParaEditar(id: number): void {
    const boletoEncontrado = this.boletoService.getBoleto(id);
    if (boletoEncontrado) {
      this.boletoActual = boletoEncontrado;
      console.log('Boleto encontrado para editar:', this.boletoActual);
      this.boletoForm.patchValue({
        _id: this.boletoActual._id,
        dni: this.boletoActual.dni,
        precio: this.boletoActual.precio,
        categoria: this.boletoActual.categoria,
        fechaCompra: this.formatDate(this.boletoActual.fechaCompra),
        email: this.boletoActual.email,
        precioTotal: this.boletoActual.precioTotal
      });
    } else {
      console.warn('No se encontró el boleto con ID para editar:', id);
      this.router.navigate(['/formulario', 0]);
    }
  }

  formatDate(date: Date): string {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2)
          month = '0' + month;
      if (day.length < 2)
          day = '0' + day;

      return [year, month, day].join('-');
  }

  guardarBoleto(): void {
    if (this.boletoForm.invalid) {
        console.warn('Formulario inválido. No se puede guardar.');
        this.boletoForm.markAllAsTouched();
        return;
    }

    const boletoData = this.boletoForm.value;
    const boletoAGuardar = new Boleto();
    boletoAGuardar._id = this.accion === 'new' ? 0 : boletoData._id;
    boletoAGuardar.dni = boletoData.dni;
    boletoAGuardar.precio = boletoData.precio;
    boletoAGuardar.categoria = Number(boletoData.categoria);
    boletoAGuardar.fechaCompra = new Date(boletoData.fechaCompra);
    boletoAGuardar.email = boletoData.email;


    if (this.accion === 'new') {
      console.log('Guardando como nuevo boleto...');
      this.boletoService.addBoleto(boletoAGuardar);
      this.cargarBoletos(); // Actualiza listaBoletos
      this.calcularResumenVentas(); // *** Calcula el resumen después de agregar ***
      console.log('Boleto agregado con éxito.');

      this.iniciarFormularioNuevo(); // Reinicia los campos del formulario
      this.router.navigate(['/formulario', 0]);

    } else { // accion === 'update'
       console.log('Actualizando boleto con ID:', boletoAGuardar._id);
       const actualizado = this.boletoService.updateBoleto(boletoAGuardar);
       if (actualizado) {
             console.log('Boleto actualizado con éxito.');
            this.cargarBoletos(); // Actualiza listaBoletos
            this.calcularResumenVentas(); // *** Calcula el resumen después de actualizar ***

             this.router.navigate(['/formulario', 0]); // Redirige a nuevo formulario
       } else {
           console.error('Error al actualizar el boleto. ID no encontrado.');
       }
    }
 }


  // --- Métodos para las Acciones de la Tabla y Resumen ---

  // Carga los boletos en la propiedad listaBoletos desde el servicio
  // Nota: calcularResumenVentas() se llama después de este método
  cargarBoletos(): void {
    this.listaBoletos = this.boletoService.getAllBoletos();
    console.log('Boletos cargados en componente para la tabla:', this.listaBoletos);
    // Ya no se necesita llamar a ningún método de DataTables aquí
  }

  // *** Método para calcular el resumen de ventas por categoría y total general ***
  calcularResumenVentas(): void {
    // Reinicia los totales antes de calcular
    // Mantenemos esta inicialización con las propiedades explícitas
    this.resumenVentas = {
        Adulto: 0,
        Menor: 0,
        Jubilado: 0,
        totalGeneral: 0
    };

    // Itera sobre la lista de boletos
    for (const boleto of this.listaBoletos) {
        // Obtenemos el valor del enum de la categoría del boleto
        const categoriaEnum = boleto.categoria;
        const precioTotal = boleto.precioTotal;

        // *** CORRECCIÓN AQUÍ: Usamos un switch para sumar al total de la categoría específica ***
        switch (categoriaEnum) {
            case CategoriaTurista.Adulto:
                this.resumenVentas.Adulto += precioTotal;
                break;
            case CategoriaTurista.Menor:
                this.resumenVentas.Menor += precioTotal;
                break;
            case CategoriaTurista.Jubilado:
                this.resumenVentas.Jubilado += precioTotal;
                break;
            default:
                // Esto manejaría cualquier valor de enum inesperado
                console.warn(`Categoría de boleto desconocida encontrada (valor de enum: ${categoriaEnum}). No se sumará al resumen por categoría.`);
                break;
        }

        // Suma al total general (esta línea ya estaba bien)
        this.resumenVentas.totalGeneral += precioTotal;
    }
    console.log('Resumen de ventas calculado:', this.resumenVentas);
}

  eliminarBoleto(id: number): void {
    console.log('Intento eliminar boleto con ID:', id);
    const eliminado = this.boletoService.deleteBoleto(id); // Llama al método del servicio para eliminar
    if (eliminado) {
      console.log('Boleto eliminado con éxito.');
      this.cargarBoletos(); // Vuelve a cargar la lista de boletos. Angular redibujará la tabla automáticamente.
      this.calcularResumenVentas(); // *** Calcula el resumen después de eliminar ***
    } else {
      console.warn('No se pudo eliminar el boleto (no encontrado).');
    }
  }

  editarBoleto(id: number): void {
    console.log('Clic en Editar boleto con ID:', id);
    this.router.navigate(["/formulario", id]);
  }

   navegarNuevoBoleto(): void {
     this.router.navigate(["/formulario", "0"]);
   }
}