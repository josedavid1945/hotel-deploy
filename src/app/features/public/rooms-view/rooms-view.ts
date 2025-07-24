import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService, Room } from '@core/services/data';
import { AuthService } from '@core/services/auth';

@Component({
  selector: 'app-rooms-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rooms-view.html',
  styleUrl: './rooms-view.css'
})
export class RoomsView {
  // Inyectamos los servicios que necesitamos
  private dataService = inject(DataService);
  authService = inject(AuthService); // Lo hacemos público para usarlo en el HTML

  // Creamos un observable que traerá la lista de habitaciones
  rooms$: Observable<Room[]> = this.dataService.getRooms();
}