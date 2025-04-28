import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JuegoAhorcadoService } from '../../services/juego-ahorcado.service';
declare var bootstrap: any; //  Agregá esto

@Component({
  selector: 'app-punto3',
  imports: [CommonModule],
  templateUrl: './punto3.component.html',
  styleUrl: './punto3.component.css',
})
export class Punto3Component {
  /**
   * Arreglo que contiene todas las letras del abecedario en mayúscula.
   * Se utiliza para mostrar los botones de letras al usuario.
   */
  abecedario: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  /**
   * Título que se mostrará en el modal del resultado (ganar o perder).
   */
  resultadoTitulo: string = '';

  /**
   * Mensaje que se mostrará en el cuerpo del modal, describiendo el resultado.
   */
  resultadoMensaje: string = '';

  /**
   * Constructor de la clase Punto3Component.
   *
   * Inyecta el servicio JuegoAhorcadoService que gestiona la lógica principal del juego.
   * @param juegoService Instancia del servicio del juego del ahorcado.
   */
  constructor(private juegoService: JuegoAhorcadoService) {}

  /**
   * Getter que expone la imagen actual del estado del juego para el template.
   * Permite mostrar la imagen actualizada sin acceder directamente al servicio en el HTML.
   */
  get imagenActual(): string {
    return this.juegoService.imagenActual;
  }

  /**
   * Getter que expone la palabra mostrada (letras adivinadas y guiones bajos) para el template.
   */
  get palabraMostrada(): string[] {
    return this.juegoService.palabraMostrada;
  }

  /**
   * Getter que expone las letras desactivadas (ya usadas) para el template.
   */
  get letrasDesactivadas(): string[] {
    return this.juegoService.letrasDesactivadas;
  }

  /**
   * Getter que expone la cantidad de aciertos que lleva el jugador.
   */
  get aciertos(): number {
    return this.juegoService.aciertos;
  }

  /**
   * Getter que expone la cantidad de errores cometidos por el jugador.
   */
  get errores(): number {
    return this.juegoService.errores;
  }

  /**
   * Procesa la letra seleccionada:
   * - Llama al servicio para validar la letra.
   * - Según el resultado, puede mostrar un modal de victoria o derrota.
   *
   * @param letra Letra seleccionada por el usuario en el juego.
   */
  desactivarLetra(letra: string): void {
    const resultado = this.juegoService.intentarLetra(letra);

    if (resultado.resultado === 'victoria') {
      this.mostrarModal('🎉 ¡Ganaste!', resultado.mensaje!);
    } else if (resultado.resultado === 'derrota') {
      this.mostrarModal('😢 ¡Perdiste!', resultado.mensaje!);
    }
  }

  /**
   * Reinicia el juego:
   * - Vuelve a empezar desde cero.
   * - Restaura la palabra, los contadores y la imagen inicial.
   */
  reiniciarJuego(): void {
    this.juegoService.iniciarJuego();
  }

  /**
   * Muestra el modal de Bootstrap con el resultado del juego.
   *
   * @param titulo Texto que aparecerá como título del modal.
   * @param mensaje Texto que aparecerá como mensaje en el cuerpo del modal.
   */
  mostrarModal(titulo: string, mensaje: string): void {
    this.resultadoTitulo = titulo;
    this.resultadoMensaje = mensaje;

    const modalElemento = document.getElementById('resultadoModal');
    if (modalElemento) {
      const modal = new bootstrap.Modal(modalElemento, {
        backdrop: 'static', // No permitir cerrar el modal clickeando afuera
        keyboard: false,    // No permitir cerrar el modal presionando "ESC"
      });
      modal.show();
    }
  }
}
