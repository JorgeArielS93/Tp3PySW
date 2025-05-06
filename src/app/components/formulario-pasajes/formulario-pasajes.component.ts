// Importaciones necesarias para Componente, Ciclo de Vida, Formularios y Rutas
import { Component, OnDestroy, OnInit } from '@angular/core'; // Ya no necesitamos AfterViewInit, OnDestroy
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Importaciones de tus modelos y servicios
import { CategoriaTurista } from '../../util/categoria-turista';
import { Boleto } from '../../models/boleto';
import { BoletoService } from '../../services/boleto.service';

// Importaciones comunes de Angular (Pipes, etc.)
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';

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
// Implementa OnDestroy para limpiar la suscripción
export class FormularioPasajesComponent implements OnInit, OnDestroy { // Implementa OnDestroy

  // --- Propiedades del Componente ---

  listaBoletos: Array<Boleto> = [];
  accion: string = "new";
  boletoActual: Boleto = new Boleto();

  resumenVentas: { Adulto: number; Menor: number; Jubilado: number; totalGeneral: number; } = {
      Adulto: 0,
      Menor: 0,
      Jubilado: 0,
      totalGeneral: 0
  };

  activeTab: 'boletos' | 'resumen' = 'boletos';

  // Propiedad para almacenar el precio total calculado dinámicamente en el formulario
  dynamicPrecioTotal: number | null = null;

  // Propiedad para guardar la suscripción a los cambios del formulario
  private formValueChangesSubscription!: Subscription;


  // Define tu formulario reactivo
  boletoForm: FormGroup = new FormGroup({
    _id: new FormControl(0),
    dni: new FormControl('', Validators.required),
    precio: new FormControl(null, [Validators.required, Validators.min(0)]),
    categoria: new FormControl(null, Validators.required),
    fechaCompra: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    // El precioTotal en el formulario no se usará para la visualización dinámica,
    // pero es necesario si lo guardas con el boleto.
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
    this.cargarBoletos();
    this.calcularResumenVentas();

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

    // *** Suscribirse a los cambios en los valores del formulario ***
    this.formValueChangesSubscription = this.boletoForm.valueChanges.subscribe(values => {
      const precio = values.precio;
      const categoria = values.categoria; // Este será el valor numérico del enum (1, 2, 3)

      // Verificamos si ambos campos tienen valores válidos para el cálculo
      if (precio !== null && precio !== undefined && !isNaN(precio) && precio >= 0 &&
          categoria !== null && categoria !== undefined && !isNaN(Number(categoria))) {

        // Ambos campos necesarios para el cálculo están presentes y parecen válidos.
        // *** Creamos una instancia temporal de Boleto para usar su método de cálculo ***
        const tempBoleto = new Boleto();
        tempBoleto.precio = precio; // Asignamos el precio base del formulario
        // Asignamos la categoría del formulario. Asegúrate de que la lógica de tu modelo
        // use esta propiedad correctamente (como valor numérico del enum).
        tempBoleto.categoria = Number(categoria);

        // *** Calculamos el precio total llamando al método del modelo Boleto ***
        this.dynamicPrecioTotal = tempBoleto.calcularPrecioTotal();
        console.log(`Cálculo dinámico: Precio base=${precio}, Categoría=${categoria}, Total=${this.dynamicPrecioTotal}`);

      } else {
        // Si falta alguno de los campos necesarios o no son válidos, ocultamos el precio dinámico
        this.dynamicPrecioTotal = null;
      }
    });
  }

  // Implementar OnDestroy para limpiar la suscripción
  ngOnDestroy(): void {
      if (this.formValueChangesSubscription) {
          this.formValueChangesSubscription.unsubscribe();
      }
      console.log('Componente FormularioPasajes destruido. Suscripción a valueChanges desuscrita.');
  }


  // --- Métodos para la Lógica del Formulario ---

  iniciarFormularioNuevo(): void {
    this.boletoActual = new Boleto();
    this.boletoActual.fechaCompra = new Date();
    this.boletoForm.reset({
        _id: 0,
        fechaCompra: this.formatDate(this.boletoActual.fechaCompra)
    });
     this.dynamicPrecioTotal = null; // Aseguramos que esté null al iniciar un formulario nuevo
  }

  cargarBoletoParaEditar(id: number): void {
    const boletoEncontrado = this.boletoService.getBoleto(id);
    if (boletoEncontrado) {
      this.boletoActual = boletoEncontrado;
      console.log('Boleto encontrado para editar:', this.boletoActual);
      // patchValue actualizará los valores del formulario, lo que disparará valueChanges
      // y recalculará dynamicPrecioTotal si precio y categoria tienen valor.
      this.boletoForm.patchValue({
        _id: this.boletoActual._id,
        dni: this.boletoActual.dni,
        precio: this.boletoActual.precio,
        categoria: this.boletoActual.categoria,
        fechaCompra: this.formatDate(this.boletoActual.fechaCompra),
        email: this.boletoActual.email,
        // Nota: precioTotal del boleto no afecta directamente el dynamicPrecioTotal
        // que se calcula en tiempo real desde el formulario.
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

    // El precioTotal del boleto A GUARDAR DEBE calcularse antes de pasarlo al servicio,
    // usando la misma lógica consistente. Puedes usar el método del modelo aquí también.
    // O asegúrate de que tu servicio lo calcule al añadir/actualizar.
    // Si tu servicio ya lo calcula, esta línea es opcional ANTES de add/update:
    // boleAGuardar.precioTotal = this.calcularPrecioTotalLocal(boleAGuardar.precio, boleAGuardar.categoria); // O usar boletoAGuardar.calcularPrecioTotal() si ya tiene precio y categoria

    if (this.accion === 'new') {
      console.log('Guardando como nuevo boleto...');
      this.boletoService.addBoleto(boletoAGuardar); // El servicio debería calcular precioTotal si aún no está hecho
      this.cargarBoletos();
      this.calcularResumenVentas();
      console.log('Boleto agregado con éxito.');

      this.iniciarFormularioNuevo(); // Reinicia los campos del formulario (también pondrá dynamicPrecioTotal a null)
      this.boletoForm.markAsUntouched();
      this.boletoForm.markAsPristine();

      this.router.navigate(['/formulario', 0]);

    } else { // accion === 'update'
       console.log('Actualizando boleto con ID:', boletoAGuardar._id);
        // Asegúrate de que el boleto actualizado tenga el precioTotal recalculado si es necesario
        // updatedBoleto.precioTotal = updatedBoleto.calcularPrecioTotal(); // Si el servicio no lo hace, hazlo aquí
       const actualizado = this.boletoService.updateBoleto(boletoAGuardar); // El servicio debería calcular precioTotal si aún no está hecho
       if (actualizado) {
             console.log('Boleto actualizado con éxito.');
            this.cargarBoletos();
            this.calcularResumenVentas();

            this.router.navigate(['/formulario', 0]); // Redirige a nuevo formulario (limpia formulario)
       } else {
           console.error('Error al actualizar el boleto. ID no encontrado.');
       }
    }
 }


  // --- Métodos para las Acciones de la Tabla y Resumen ---

  cargarBoletos(): void {
    this.listaBoletos = this.boletoService.getAllBoletos();
    console.log('Boletos cargados en componente para la tabla:', this.listaBoletos);
    // calcularResumenVentas() se llama después de este método
  }

  calcularResumenVentas(): void {
      this.resumenVentas = {
          Adulto: 0,
          Menor: 0,
          Jubilado: 0,
          totalGeneral: 0
      };

      for (const boleto of this.listaBoletos) {
          const categoriaEnum = boleto.categoria;
          const precioTotal = boleto.precioTotal; // Usamos el precioTotal YA CALCULADO en el boleto guardado

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
                  console.warn(`Categoría de boleto desconocida encontrada (valor de enum: ${categoriaEnum}). No se sumará al resumen por categoría.`);
                  break;
          }
          this.resumenVentas.totalGeneral += precioTotal;
      }
      console.log('Resumen de ventas calculado:', this.resumenVentas);
  }

  eliminarBoleto(id: number): void {
    console.log('Intento eliminar boleto con ID:', id);
    const eliminado = this.boletoService.deleteBoleto(id);
    if (eliminado) {
      console.log('Boleto eliminado con éxito.');
      this.cargarBoletos();
      this.calcularResumenVentas();
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

  selectTab(tab: 'boletos' | 'resumen'): void {
    this.activeTab = tab;
    console.log('Pestaña activa cambiada a:', this.activeTab);
  }
}