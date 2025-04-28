import { Injectable } from '@angular/core';
import { Animal } from '../models/animal';

@Injectable({
  providedIn: 'root',
})

export class JuegoAhorcadoService {
  /**
   * Array de animales disponibles para jugar.
   * Cada animal tiene un nombre que será la palabra a adivinar.
   */
  private animales: Animal[] = [
    { nombre: 'CANGURO' },
    { nombre: 'TIGRE' },
    { nombre: 'LEON' },
    { nombre: 'JIRAFA' },
    { nombre: 'CEBRA' },
    { nombre: 'PANDA' },
    { nombre: 'COCODRILO' },
    { nombre: 'HIPOPOPOTAMO' },
    { nombre: 'PINGUINO' },
    { nombre: 'ELEFANTE' }
  ];

  /**
   * Palabra seleccionada que el jugador debe adivinar.
   */
  palabra: string = '';

  /**
   * Representación visual de la palabra a adivinar.
   * Letras no adivinadas se muestran como guiones bajos `_`.
   */
  palabraMostrada: string[] = [];

  /**
   * Array que guarda las letras que el jugador ya ha seleccionado (para deshabilitar los botones).
   */
  letrasDesactivadas: string[] = [];

  /**
   * Cantidad de letras acertadas por el jugador.
   */
  aciertos: number = 0;

  /**
   * Cantidad de letras falladas por el jugador.
   */
  errores: number = 0;

  /**
   * Número máximo de intentos permitidos antes de perder.
   */
  intentosMaximos: number = 5;

  /**
   * Número de intentos actuales realizados por el jugador.
   */
  intentosActuales: number = 0;

  /**
   * Ruta de la imagen que representa el estado actual del juego (ahorcado).
   */
  imagenActual: string = 'images/ahorcado/ahorcado0.png';

  /**
   * Constructor de la clase.
   * 
   * Al crear la instancia del servicio, se inicializa automáticamente el juego.
   */
  constructor() {
    this.iniciarJuego();
  }

  /**
   * Inicializa el juego:
   * - Selecciona aleatoriamente una palabra del listado de animales.
   * - Configura la palabraMostrada con guiones bajos y la primera letra visible.
   * - Resetea los contadores de aciertos, errores e intentos.
   * - Restablece la imagen inicial del ahorcado.
   */
  iniciarJuego(): void {
    const animalAleatorio = this.animales[Math.floor(Math.random() * this.animales.length)];
    this.palabra = animalAleatorio.nombre;

    this.palabraMostrada = Array(this.palabra.length).fill('_');
    this.palabraMostrada[0] = this.palabra[0]; // Mostrar siempre la primera letra como pista

    this.letrasDesactivadas = [];
    this.aciertos = 0;
    this.errores = 0;
    this.intentosActuales = 0;
    this.imagenActual = 'images/ahorcado/ahorcado0.png';
  }

  /**
   * Procesa la letra seleccionada por el jugador:
   * - Desactiva la letra seleccionada para que no se pueda volver a elegir.
   * - Verifica si la letra forma parte de la palabra a adivinar.
   * - Actualiza el progreso del jugador (aciertos o errores).
   * - Actualiza la imagen del ahorcado si se falla un intento.
   * 
   * @param letra Letra seleccionada por el jugador.
   * @returns Un objeto indicando el resultado:
   *          - 'ninguno' si el juego continúa,
   *          - 'victoria' si adivinó toda la palabra,
   *          - 'derrota' si se quedó sin intentos.
   */
  intentarLetra(letra: string): { resultado: 'ninguno' | 'victoria' | 'derrota', mensaje?: string } {
    this.letrasDesactivadas.push(letra);
    let acierto = false;

    // Recorrer cada letra de la palabra para verificar si la seleccionada coincide
    for (let i = 0; i < this.palabra.length; i++) {
      if (this.palabra[i] === letra && this.palabraMostrada[i] === '_') {
        this.palabraMostrada[i] = letra;
        acierto = true;
      }
    }

    if (acierto) {
      this.aciertos++;

      // Verificar si ya no quedan guiones bajos (todas las letras adivinadas)
      if (!this.palabraMostrada.includes('_')) {
        return { resultado: 'victoria', mensaje: '¡Felicitaciones, adivinaste la palabra!' };
      }
    } else {
      this.errores++;
      this.intentosActuales++;
      this.imagenActual = `images/ahorcado/ahorcado${this.intentosActuales}.png`;

      // Si se superaron los intentos máximos, el jugador pierde
      if (this.intentosActuales >= this.intentosMaximos) {
        return { resultado: 'derrota', mensaje: `La palabra era: ${this.palabra}` };
      }
    }

    // Si no ganó ni perdió, el juego continúa
    return { resultado: 'ninguno' };
  }
}
  
