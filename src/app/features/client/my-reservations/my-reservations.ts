import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Se importa el operador 'map' de RxJS
import { Observable, of, map } from 'rxjs';
import { EventReservation, RoomReservation, DataService } from '@core/services/data';
import { AuthService } from '@core/services/auth';
import { FirestoreDatePipe } from '@shared/pipes/firestore-date-pipe';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, FirestoreDatePipe],
  templateUrl: './my-reservations.html',
  styleUrl: './my-reservations.css'
})
export class MyReservations implements OnInit {
  private authService = inject(AuthService);
  private dataService = inject(DataService);

  eventReservations$: Observable<EventReservation[]> = of([]);
  roomReservations$: Observable<RoomReservation[]> = of([]);

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      // Obtenemos las reservas de habitaciones y transformamos las fechas
      this.roomReservations$ = this.dataService.getRoomReservationsForUser(currentUser.uid).pipe(
        map(reservations => reservations.map(res => {
          // Se usan los nombres de propiedad correctos
          return {
            ...res, // Copia todos los datos originales de la reservación
            checkInDate: (res.checkInDate as any)?.toDate(),
            checkOutDate: (res.checkOutDate as any)?.toDate()
          };
        }))
      );

      // Obtenemos las reservas de eventos y transformamos las fechas
      this.eventReservations$ = this.dataService.getEventReservationsForUser(currentUser.uid).pipe(
        map(reservations => reservations.map(res => {
          // --- CORRECCIÓN APLICADA AQUÍ ---
          // Se convierte la propiedad 'reservationDate' que sí existe en el objeto.
          return {
            ...res, // Copia todos los datos originales
            reservationDate: (res.reservationDate as any)?.toDate() // Convierte el Timestamp a Date
          };
        }))
      );
    }
  }
}