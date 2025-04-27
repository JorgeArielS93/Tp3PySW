import { Component } from '@angular/core';
import { Noticia } from '../../models/noticia';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-punto1',
  imports: [NgFor],
  templateUrl: './punto1.component.html',
  styleUrl: './punto1.component.css'
})
export class Punto1Component {
  noticias: Noticia[] = [
    {
      titulo: 'Caputo se reunió con Georgieva tras el nuevo acuerdo con el FMI: “Fue espectacular”',
      noticia: 'El ministro mantuvo un encuentro con la directora general del organismo para seguir de cerca la marcha del plan económico; la funcionaria destacó la “labor por consolidar la estabilidad económica”',
      img: 'noticia01.png'
    },
    {
      titulo: '12 años de papado. Las personalidades que se reunieron con Francisco',
      noticia: 'En sus 12 años de papado, el sumo pontífice se encontró con figuras y personalidades de todo calibre, desde reyes a referentes deportivos',
      img: 'noticia02.png'
    },
    {
      titulo: '“Deben prestar especial atención”. Anuncian cambios en el procedimiento para solicitar visas de ingreso a EE.UU.',
      noticia: 'Será necesario que coincidan dos códigos solicitados durante el trámite; empieza a regir el viernes 2 de mayo',
      img: 'noticia03.png'
    }
  ];
}
