import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, HotelEvent, EventReservation } from '@core/services/data';
import { Observable } from 'rxjs';
import { AuthService } from '@core/services/auth';
import { RouterLink } from '@angular/router';
import { Timestamp } from 'firebase/firestore'; // Importa Timestamp
import { CloudinaryService } from '@core/services/cloudinary';

@Component({
  selector: 'app-events-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './events-view.html',
  styleUrl: './events-view.css'
})
export class EventsView {
  private dataService = inject(DataService);
  authService = inject(AuthService);
  events$: Observable<HotelEvent[]> = this.dataService.getEvents();
  
  ticketQuantities = Array.from({length: 10}, (_, i) => i + 1);

  // --- NUEVO MÉTODO PARA MANEJAR LA RESERVA ---
  async reserveTickets(event: HotelEvent, quantitySelect: HTMLSelectElement) {
    const tickets = parseInt(quantitySelect.value, 10);
    const currentUser = this.authService.currentUser();

    // Verificamos que haya un usuario logueado
    if (!currentUser) {
      alert("Debes iniciar sesión para reservar.");
      return;
    }

    // Verificamos que haya suficientes entradas
    if (event.capacity && tickets > event.capacity) {
      alert(`Lo sentimos, solo quedan ${event.capacity} entradas disponibles.`);
      return;
    }

    // Creamos el objeto de la reserva
    const reservation: Omit<EventReservation, 'id'> = {
      eventId: event.id!,
      eventName: event.name,
      userId: currentUser.uid,
      userEmail: currentUser.email!,
      tickets: tickets,
      totalPrice: (event.price || 0) * tickets,
      reservationDate: new Date()
    };

    try {
      await this.dataService.addEventReservation(reservation);
      alert(`¡Reserva exitosa para ${tickets} entrada(s) para ${event.name}!`);
      // Aquí podríamos también actualizar la capacidad del evento, pero lo dejaremos para una mejora futura.
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      alert("Hubo un error al procesar tu reserva. Inténtalo de nuevo.");
    }
  }
}