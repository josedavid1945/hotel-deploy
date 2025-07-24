  import { CommonModule } from '@angular/common';
  import { Component,inject } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { DataService, Hall, HotelEvent, Room } from '@core/services/data';
  import { Observable } from 'rxjs';
  import { RoomsView } from '../rooms-view/rooms-view';
  import { AuthService } from '@core/services/auth';

  @Component({
    selector: 'app-home',
    imports: [CommonModule],
    templateUrl: './home.html',
    styleUrl: './home.css'
  })
  export class Home {
    
    private  dataService = inject(DataService);
    authService = inject(AuthService);
    private router = inject(Router);

    events$:Observable<HotelEvent[]>=this.dataService.getEvents();
    rooms$: Observable<Room[]>= this.dataService.getRooms();
    halls$: Observable<Hall[]>= this.dataService.getHalls();
    

  }
