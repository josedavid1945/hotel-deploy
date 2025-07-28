import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
// CORRECCIÓN: Rutas de importación completas
import { DataService, Hall } from '@core/services/data';
import { AuthService } from '@core/services/auth';

@Component({
  selector: 'app-halls-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './halls-view.html',
  styleUrls: ['./halls-view.css']
})
export class HallsView { 
  private dataService = inject(DataService);
  authService = inject(AuthService);
  private router = inject(Router);

  today = new Date().toISOString().split('T')[0];

  halls$: Observable<Hall[]> = this.dataService.getHalls();

  async reserveHall(hall: Hall, dateInput: HTMLInputElement) {
    const eventDate = dateInput.value;
    const currentUser = this.authService.currentUser();

    if (!currentUser) { 
      alert("Debes iniciar sesión para reservar.");
      return; 
    }
    if (!eventDate) {
      alert("Por favor, selecciona una fecha para el evento.");
      return;
    }

    const reservation = {
      hallId: hall.id!,
      hallName: hall.name,
      userId: currentUser.uid,
      userEmail: currentUser.email!,
      eventDate: new Date(eventDate),
      reservationDate: new Date()
    };

    try {
      await this.dataService.addHallReservation(reservation);
      alert(`Requerimento para "${hall.name}" en la fecha ${eventDate} será atendido por correo ${currentUser.email}.`);
      this.router.navigate(['/cliente/mis-reservas']);
    } catch (error) {
      console.error("Error al reservar el salón:", error);
    }
  }
}