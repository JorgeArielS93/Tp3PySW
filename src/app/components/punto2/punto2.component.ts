import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-punto2',
  imports: [NgFor,NgIf],
  templateUrl: './punto2.component.html',
  styleUrl: './punto2.component.css'
})
export class Punto2Component {
mensaje= "puta la wea";
noticia="hola mundo";
productos:Producto[] = [
  {
    nombre:"notebook asus 13L",
    descripcion:"disco 40GB, 15 pulgadas, 12 gb ram, windows 11 pro",
    img:"producto01.jpg",
    precio: 56000
  },
  {
    nombre: "Monitor LG 14",
    descripcion: "HDR, 1080p full hd, IPS colores vividos",
    img: "producto02.jpg",
    precio: 99
  },
  {
    nombre: "SSD Adata 240G",
    descripcion: " Western Digital WD Green WDS480G2G0A 480GB verde",
    img: "producto03.jpg",
    precio: 999
  },
  {
    nombre:"Carry Disk Case",
    descripcion:"Usb 3.0 Sata 2.5 Notebook Disco Hdd / Sdd - QAABA, compatible w10 , w11 y linux 64 bits",
    img:"producto04.jpg",
    precio: 56000
  },
  {
    nombre: "Procesador AMD Ryzen 7 5700G",
    descripcion: "100-100000263BOX de 8 núcleos y 4.6GHz de frecuencia con gráfica integrada",
    img: "producto05.jpg",
    precio: 99
  },
  {
    nombre: "Placa De Video Nvidia Msi Rtx 3060",
    descripcion: " Boost Clock / Velocidad de memoria 1807 MHz / 15 Gbps 12GB GDDR6",
    img: "producto06.jpg",
    precio: 999
  }
]
arrayCarrito: Producto[]=[

]

agregarAlCarrito(producto: Producto) {
  if (!this.estaEnCarrito(producto)) {
    this.arrayCarrito.push(producto);
  }
}

eliminarDelCarrito(producto: Producto) {
  this.arrayCarrito = this.arrayCarrito.filter(p => p !== producto);
}

vaciarCarrito() {
  this.arrayCarrito = [];
}

calcularTotal(): number {
  return this.arrayCarrito.reduce((total, prod) => total + prod.precio, 0);
}

estaEnCarrito(producto: Producto): boolean {
  return this.arrayCarrito.some(p => p.nombre === producto.nombre);
}


}
