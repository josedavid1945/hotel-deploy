import { Component } from '@angular/core';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainLayoutComponent], // Importamos nuestro layout principal
  template: `<app-main-layout></app-main-layout>`, // Y lo mostramos
  styles: [],
})
export class AppComponent {}