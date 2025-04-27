import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
declare var bootstrap: any; // 👈 Agregá esto

@Component({
  selector: 'app-punto3',
  imports: [CommonModule],
  templateUrl: './punto3.component.html',
  styleUrl: './punto3.component.css'
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

  // Abecedario utilizado para los botones de letras
  abecedario: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Array que contiene las letras ya desactivadas (letras ya intentadas)
  letrasDesactivadas: string[] = [];

  // Contadores para aciertos y errores
  aciertos: number = 0;
  errores: number = 0;

  // Lista de palabras de animales que se pueden adivinar
  animales: string[] = [
    'ELEFANTE', 'TIGRE', 'LEON', 'JIRAFA', 'CEBRA',
    'PANDA', 'COCODRILO', 'HIPOPOPOTAMO', 'PINGUINO', 'CANGURO'
  ];

  // Variables relacionadas con la palabra a adivinar
  palabra: string = '';           // Palabra seleccionada aleatoriamente
  palabraMostrada: string[] = []; // Palabra mostrada al jugador con _ para las letras no descubiertas

  // Variables para los intentos
  intentosMaximos: number = 5;     // Número máximo de intentos
  intentosActuales: number = 0;    // Intentos utilizados hasta ahora

  // Imagen relacionada con los intentos (imagen del ahorcado)
  imagenActual: string = 'images/ahorcado/ahorcado0.png';

  // Variables para el modal de resultado (mostrar mensaje de victoria o derrota)
  resultadoTitulo: string = '';
  resultadoMensaje: string = '';
  resultadoImagen: string = '';

  // Constructor que llama al método iniciarJuego cuando se inicializa el componente
  constructor() {
    this.iniciarJuego();
  }

  /**
   * Inicializa el juego con una palabra aleatoria y restablece los valores del juego.
   * Se selecciona una palabra aleatoria de la lista de animales y se prepara la palabra mostrada
   * con la primera letra revelada.
   */
  iniciarJuego() {
    // Elegir palabra aleatoria
    this.palabra = this.animales[Math.floor(Math.random() * this.animales.length)];
    console.log('Palabra secreta:', this.palabra); // Para depuración
  
    // Inicializar pantalla: Mostrar solo la primera letra
    this.palabraMostrada = Array(this.palabra.length).fill('_');
    this.palabraMostrada[0] = this.palabra[0]; // Mostrar la primera letra

    // Restablecer el contador de intentos y la imagen inicial
    this.intentosActuales = 0;
    this.imagenActual = 'images/ahorcado/ahorcado0.png';

    // Restablecer las letras desactivadas (letras ya intentadas)
    this.letrasDesactivadas = [];
    
    // Restablecer contadores de aciertos y errores
    this.aciertos = 0;
    this.errores = 0;
  }

  /**
   * Método llamado cuando el jugador hace clic en una letra.
   * Este método verifica si la letra está en la palabra y actualiza el estado del juego.
   * Si la letra es correcta, aumenta el contador de aciertos y muestra la letra en la palabra mostrada.
   * Si la letra es incorrecta, incrementa los errores y el contador de intentos.
   * @param letra La letra que el jugador ha intentado adivinar
   */
  desactivarLetra(letra: string) {
    // Añadir la letra al array de letras desactivadas para que no pueda ser clickeada de nuevo
    this.letrasDesactivadas.push(letra);
  
    let acierto = false;
  
    // Verificar si la letra está en la palabra
    for (let i = 0; i < this.palabra.length; i++) {
      if (this.palabra[i] === letra && this.palabraMostrada[i] === '_') {
        // Si la letra está en la palabra y aún no ha sido descubierta, revelarla
        this.palabraMostrada[i] = letra;
        acierto = true;
      }
    }
  
    // Si acertó al menos una letra
    if (acierto) {
      this.aciertos++; // Aumentar contador de aciertos
      // Verificar si la palabra ha sido completamente adivinada
      if (!this.palabraMostrada.includes('_')) {
        this.mostrarModal('🎉 ¡Ganaste!', '¡Felicitaciones, adivinaste la palabra!');
      }
    } else {
      // Si no acertó ninguna letra
      this.intentosActuales++; // Incrementar el número de intentos realizados
      this.errores++; // Aumentar el contador de errores
      // Actualizar la imagen del ahorcado según los intentos
      this.imagenActual = `images/ahorcado/ahorcado${this.intentosActuales}.png`;
  
      // Si los intentos superan el máximo permitido, el jugador ha perdido
      if (this.intentosActuales >= this.intentosMaximos) {
        this.mostrarModal('😢 ¡Perdiste!', `La palabra era: ${this.palabra}`);
      }
    }
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
        keyboard: false      // No permitir cerrar el modal con la tecla Esc
      });
      modal.show();
    }
  }

  /**
   * Reinicia el juego llamando al método iniciarJuego.
   * Esto restablece todos los valores y comienza una nueva ronda del juego.
   */
  reiniciarJuego() {
    this.iniciarJuego();
  }
}