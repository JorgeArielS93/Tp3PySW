import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/layout/header/header.component";
import { FooterComponent } from "./components/layout/footer/footer.component";
import { Punto1Component } from "./components/punto1/punto1.component";
import { Punto2Component } from "./components/punto2/punto2.component";
import { Punto3Component } from "./components/punto3/punto3.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, Punto1Component, Punto2Component, Punto3Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tp3_PracticaAngular';
}
