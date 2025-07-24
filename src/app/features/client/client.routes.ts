import { Routes } from '@angular/router';
import { MyReservations } from '@features/client/my-reservations/my-reservations';
import { BookRoom } from './book-room/book-room';

export const CLIENT_ROUTES: Routes = [
  { path: 'mis-reservas', component: MyReservations },
  { path: 'reservar-habitacion/:id', component: BookRoom },
];