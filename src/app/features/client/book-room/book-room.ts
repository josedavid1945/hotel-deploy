import { Component, OnDestroy, OnInit, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService, Room, RoomReservation } from '@core/services/data'; 
import { AuthService } from '@core/services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-room.html',
  styleUrls: ['./book-room.css']
})
export class BookRoom implements OnInit, OnDestroy {
  // Inyección de dependencias
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private authService = inject(AuthService);

  // Señales para manejar el estado
  room: WritableSignal<Room | null> = signal(null);
  reservationForm: FormGroup;
  numberOfNights = signal(0);
  totalPrice = signal(0);
  
  // Propiedades para la lógica de disponibilidad
  private existingReservations: RoomReservation[] = [];
  availabilityStatus: WritableSignal<'idle' | 'checking' | 'available' | 'unavailable'> = signal('idle');
  private formChangesSubscription?: Subscription;

  // CORRECCIÓN: Propiedad para la fecha de hoy, para validar en el HTML
  today = new Date().toISOString().split('T')[0];

  constructor() {
    this.reservationForm = this.fb.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('id');
    if (roomId) {
      // 1. Obtener datos de la habitación
      this.dataService.getRoomById(roomId).then(roomSnap => {
        if (roomSnap.exists()) {
          this.room.set({ id: roomSnap.id, ...roomSnap.data() } as Room);
        } else {
          this.router.navigate(['/habitaciones']);
        }
      });

      // 2. Obtener todas las reservas existentes para este tipo de habitación
      this.dataService.getReservationsForRoom(roomId).subscribe(reservations => {
        this.existingReservations = reservations;
        this.checkAvailability();
      });

      // 3. Escuchar cambios en las fechas para recalcular y verificar
      this.formChangesSubscription = this.reservationForm.valueChanges.subscribe(values => {
        this.checkAvailability();
      });
    }
  }

  ngOnDestroy(): void {
    this.formChangesSubscription?.unsubscribe();
  }

  // Método combinado que calcula el precio Y verifica la disponibilidad
  checkAvailability() {
    const { checkInDate, checkOutDate } = this.reservationForm.value;
    const roomData = this.room();

    if (!checkInDate || !checkOutDate || new Date(checkOutDate) <= new Date(checkInDate) || !roomData) {
      this.numberOfNights.set(0);
      this.totalPrice.set(0);
      this.availabilityStatus.set('idle');
      return;
    }

    const diffTime = new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    this.numberOfNights.set(nights);
    const roomPrice = roomData.price ?? 0;
    this.totalPrice.set(nights * roomPrice);

    this.availabilityStatus.set('checking');
    const newCheckIn = new Date(checkInDate);
    const newCheckOut = new Date(checkOutDate);

    const overlappingReservationsCount = this.existingReservations.filter(res => {
      const existingCheckIn = (res.checkInDate as any).toDate();
      const existingCheckOut = (res.checkOutDate as any).toDate();
      return newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;
    }).length;
    
    if (roomData.quantity > overlappingReservationsCount) {
      this.availabilityStatus.set('available');
    } else {
      this.availabilityStatus.set('unavailable');
    }
  }

  async onSubmit() {
    if (this.reservationForm.invalid || this.availabilityStatus() !== 'available') {
      alert("Por favor, selecciona un rango de fechas válido y disponible.");
      return;
    }
    
    const finalPrice = this.totalPrice();
    const reservationData: Omit<RoomReservation, 'id'> = {
      roomId: this.room()!.id!,
      roomName: this.room()!.name,
      userId: this.authService.currentUser()!.uid,
      userEmail: this.authService.currentUser()!.email!,
      checkInDate: new Date(this.reservationForm.value.checkInDate),
      checkOutDate: new Date(this.reservationForm.value.checkOutDate),
      totalPrice: finalPrice,
      reservationDate: new Date()
    };

    try {
      await this.dataService.addRoomReservation(reservationData);
      alert('¡Habitación reservada con éxito!');
      this.router.navigate(['/cliente/mis-reservas']);
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      alert('Hubo un error al procesar la reserva.');
    }
  }
}