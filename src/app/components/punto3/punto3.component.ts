import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JuegoAhorcadoService } from '../../services/juego-ahorcado.service';
declare var bootstrap: any; // 👈 Agregá esto

@Component({
  selector: 'app-punto3',
  imports: [CommonModule],
  templateUrl: './punto3.component.html',
  styleUrl: './punto3.component.css',
})
export class Punto3Component {
  // contador:number=0

  // incrementar(){
  // this.contador++;
  // }

  // decrementar() {
  //   if (this.contador <= 0) {
  //     alert('⚠️ No se permiten números negativos');
  //   } else {
  //     this.contador--;
  //   }
  // }
  // reestrablecer(){
  //   this.contador=0
  // }
  // ***********************Juego Ahorcado***********************

  /**
   * Arreglo que contiene todas las letras del abecedario en mayúscula.
   * Se utiliza para mostrar las opciones de letras al usuario.
   */
  abecedario: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  /**
   * Título del modal que muestra el resultado del juego (victoria o derrota).
   */
  resultadoTitulo: string = '';

  /**
   * Mensaje del modal que proporciona más detalles sobre el resultado del juego.
   */
  resultadoMensaje: string = '';

  /**
   * Constructor de la clase.
   *
   * Inyecta el servicio JuegoAhorcadoService que gestiona la lógica del juego.
   * @param juegoService Instancia del servicio del ahorcado que maneja el estado del juego.
   */
  constructor(public juegoService: JuegoAhorcadoService) {

  }

  /**
   * Procesa la letra seleccionada llamando al servicio, y muestra un modal si el usuario gana o pierde.
   *
   * @param letra Letra que seleccionó el usuario.
   */
  desactivarLetra(letra: string) {
    const resultado = this.juegoService.intentarLetra(letra);

    if (resultado.resultado === 'victoria') {
      this.mostrarModal('🎉 ¡Ganaste!', resultado.mensaje!);
    } else if (resultado.resultado === 'derrota') {
      this.mostrarModal('😢 ¡Perdiste!', resultado.mensaje!);
    }
  }

  /**
   * Reinicia el juego llamando al servicio.
   *
   * Resetea la palabra, errores, aciertos, letras desactivadas e imagen inicial.
   */
  reiniciarJuego() {
    this.juegoService.iniciarJuego();
  }

  /**
   * Muestra un modal con el resultado del juego (ganar o perder).
   * El modal se muestra con un mensaje de victoria o derrota, dependiendo del estado actual del juego.
   * @param titulo Título del modal, que indica si el jugador ganó o perdió
   * @param mensaje Mensaje del modal que proporciona más detalles sobre el resultado
   */
  mostrarModal(titulo: string, mensaje: string) {
    // Asignar el título y el mensaje que se mostrarán en el modal
    this.resultadoTitulo = titulo;
    this.resultadoMensaje = mensaje;

    // Mostrar el modal con el resultado del juego
    const modalElemento = document.getElementById('resultadoModal');
    if (modalElemento) {
      const modal = new bootstrap.Modal(modalElemento, {
        backdrop: 'static', // No permitir cerrar el modal haciendo clic fuera de él
        keyboard: false, // No permitir cerrar el modal con la tecla Esc
      });
      modal.show();
    }
  }
}
