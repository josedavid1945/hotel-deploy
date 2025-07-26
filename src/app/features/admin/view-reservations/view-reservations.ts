import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DataService, RoomReservation, EventReservation, HallReservation, User } from '@core/services/data';
import { FirestoreDatePipe } from '@shared/pipes/firestore-date-pipe';

@Component({
  selector: 'app-view-reservations',
  standalone: true,
  imports: [CommonModule, FirestoreDatePipe],
  templateUrl: './view-reservations.html',
  styleUrl: './view-reservations.css'
})
export class ViewReservations {
  private dataService = inject(DataService);

  // Observables para obtener todas las reservas
  allRoomReservations$: Observable<RoomReservation[]> = this.dataService.getAllRoomReservations();
  allEventReservations$: Observable<EventReservation[]> = this.dataService.getAllEventReservations();
  allHallReservations$: Observable<HallReservation[]>= this.dataService.getHallReservations();
  allUsers$: Observable<User[]>= this.dataService.getAllUsers();
}