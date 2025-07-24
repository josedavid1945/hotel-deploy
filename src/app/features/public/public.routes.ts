import { Routes } from '@angular/router';
// CORRECCIÓN: Los nombres de las clases no llevan 'Component' al final
import { Home } from './home/home';
import { RoomsView } from './rooms-view/rooms-view';
import { HallsView } from './halls-view/halls-view';
import { EventsView } from './events-view/events-view';
import { ManageEvents } from '@features/admin/manage-events/manage-events';

export const PUBLIC_ROUTES: Routes = [
  // CORRECCIÓN: Usamos los nombres corregidos aquí también
  { path: '', component: Home },
  { path: 'habitaciones', component: RoomsView },
  { path: 'salones', component: HallsView },
  { path: 'eventos', component: EventsView },
  { path: 'eventos', component: ManageEvents } 
];