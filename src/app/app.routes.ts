import { Routes } from '@angular/router';
import { Punto1Component } from './components/punto1/punto1.component';
import { Punto2Component } from './components/punto2/punto2.component';
import { Punto3Component } from './components/punto3/punto3.component';

export const routes: Routes = [
    {
        path: "punto1",
        component: Punto1Component
    },
    {
        path: "punto2",
        component: Punto2Component
    },
    {
        path: "punto3",
        component: Punto3Component
    },
    { path: '**', pathMatch:'full',redirectTo:'punto1' } 
];
