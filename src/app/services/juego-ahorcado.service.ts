import { Injectable } from '@angular/core';
import { Animal } from '../models/animal';

@Injectable({
  providedIn: 'root',
})
export class JuegoAhorcadoService {
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
 * Palabra completa que el jugador debe adivinar. 
 */
palabra: string = '';

/** 
 * Representación de la palabra a adivinar, mostrando letras reveladas y guiones bajos ('_') en lugar de las ocultas. 
 */
palabraMostrada: string[] = [];

/** 
 * Letras que el jugador ya ha seleccionado y que deben estar desactivadas en la interfaz para evitar repetirlas. 
 */
letrasDesactivadas: string[] = [];

/** 
 * Número de letras correctamente adivinadas por el jugador. 
 */
aciertos: number = 0;

/** 
 * Número de errores cometidos al seleccionar letras incorrectas. 
 */
errores: number = 0;

/** 
 * Número máximo de intentos permitidos antes de que el jugador pierda. 
 */
intentosMaximos: number = 5;

/** 
 * Número de intentos realizados hasta el momento en la partida actual. 
 */
intentosActuales: number = 0;

/** 
 * Ruta de la imagen que representa el estado actual del ahorcado (cambia con cada error). 
 */
imagenActual: string = 'images/ahorcado/ahorcado0.png';

/**
 * Constructor de la clase.
 * - Inicializa automáticamente una nueva partida al crear una instancia del servicio.
 */
constructor() {
  this.iniciarJuego();
}


  /**
 * Inicializa o reinicia el juego del ahorcado.
 * - Selecciona aleatoriamente un animal de la lista disponible.
 * - Prepara la palabra mostrada con guiones bajos ('_') en lugar de letras, revelando solo la primera letra.
 * - Resetea las letras desactivadas, los contadores de aciertos y errores, los intentos realizados y la imagen mostrada.
 */
iniciarJuego(): void {
  const animalAleatorio = this.animales[Math.floor(Math.random() * this.animales.length)];
  this.palabra = animalAleatorio.nombre;
  this.palabraMostrada = Array(this.palabra.length).fill('_');
  this.palabraMostrada[0] = this.palabra[0];

  this.letrasDesactivadas = [];
  this.aciertos = 0;
  this.errores = 0;
  this.intentosActuales = 0;
  this.imagenActual = 'images/ahorcado/ahorcado0.png';
}

/**
 * Procesa la letra seleccionada por el usuario.
 * 
 * - Marca la letra como desactivada para que no pueda seleccionarse nuevamente.
 * - Verifica si la letra existe en la palabra a adivinar.
 *   - Si acierta, revela la letra en la palabra mostrada y aumenta el contador de aciertos.
 *   - Si no acierta, incrementa los errores, actualiza la imagen del ahorcado y los intentos actuales.
 * - Evalúa si el jugador ha ganado (adivinó toda la palabra) o perdido (agotó los intentos).
 * 
 * @param letra Letra seleccionada por el usuario.
 * @returns Un objeto indicando el estado del juego:
 *  - 'victoria' si adivinó toda la palabra,
 *  - 'derrota' si se agotaron los intentos,
 *  - 'ninguno' si el juego sigue en curso.
 *  También puede incluir un mensaje para mostrar en el modal.
 */
intentarLetra(letra: string): { resultado: 'ninguno' | 'victoria' | 'derrota', mensaje?: string } {
  this.letrasDesactivadas.push(letra);
  let acierto = false;

  for (let i = 0; i < this.palabra.length; i++) {
    if (this.palabra[i] === letra && this.palabraMostrada[i] === '_') {
      this.palabraMostrada[i] = letra;
      acierto = true;
    }
  }

  if (acierto) {
    this.aciertos++;
    if (!this.palabraMostrada.includes('_')) {
      return { resultado: 'victoria', mensaje: '¡Felicitaciones, adivinaste la palabra!' };
    }
  } else {
    this.errores++;
    this.intentosActuales++;
    this.imagenActual = `images/ahorcado/ahorcado${this.intentosActuales}.png`;

    if (this.intentosActuales >= this.intentosMaximos) {
      return { resultado: 'derrota', mensaje: `La palabra era: ${this.palabra}` };
    }
  }

  return { resultado: 'ninguno' };
}
}
