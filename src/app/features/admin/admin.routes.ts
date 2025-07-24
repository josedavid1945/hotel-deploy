import { Routes } from '@angular/router';
import { ManageRooms } from './manage-rooms/manage-rooms';
import { ManageHalls } from './manage-halls/manage-halls';
import { ManageEvents } from './manage-events/manage-events';
import { ViewReservations } from './view-reservations/view-reservations'; // <-- Importa

// ...
export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'habitaciones', pathMatch: 'full' },
  { path: 'habitaciones', component: ManageRooms },
  { path: 'salones', component: ManageHalls },
  { path: 'eventos', component: ManageEvents },
  { path: 'reservas', component: ViewReservations } // <-- Añade
];