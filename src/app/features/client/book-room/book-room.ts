import { Component, OnInit, OnDestroy, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// CORRECCIÓN: Asegúrate de que la ruta de importación sea la correcta
import { DataService, Room, RoomReservation } from '@core/services/data';
import { AuthService } from '@core/services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-room.html',
  styleUrl: './book-room.css'
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
        // Hacemos una verificación inicial por si el formulario ya tiene valores
        this.calculatePriceAndCheckAvailability(this.reservationForm.value.checkInDate, this.reservationForm.value.checkOutDate);
      });

      // 3. Escuchar cambios en las fechas para recalcular y verificar
      this.formChangesSubscription = this.reservationForm.valueChanges.subscribe(values => {
        this.calculatePriceAndCheckAvailability(values.checkInDate, values.checkOutDate);
      });
    }
  }

  ngOnDestroy(): void {
    this.formChangesSubscription?.unsubscribe();
  }

  // Método combinado que calcula el precio Y verifica la disponibilidad
  calculatePriceAndCheckAvailability(checkIn: string, checkOut: string) {
    if (checkIn && checkOut) {
      const diffTime = new Date(checkOut).getTime() - new Date(checkIn).getTime();
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        this.numberOfNights.set(nights);
        const roomPrice = this.room()?.price ?? 0;
        this.totalPrice.set(nights * roomPrice);

        // Inicia la verificación de disponibilidad
        this.availabilityStatus.set('checking');
        const newCheckIn = new Date(checkIn);
        const newCheckOut = new Date(checkOut);
        const roomData = this.room();

        // Contamos las reservas que se cruzan con las fechas seleccionadas
        const overlappingReservationsCount = this.existingReservations.filter(res => {
          const existingCheckIn = res.checkInDate;
          const existingCheckOut = res.checkOutDate;
          return newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;
        }).length;
        
        // Comparamos con la cantidad total de habitaciones de este tipo
        if (roomData && roomData.quantity > overlappingReservationsCount) {
          this.availabilityStatus.set('available');
        } else {
          this.availabilityStatus.set('unavailable');
        }

      } else {
        this.numberOfNights.set(0);
        this.totalPrice.set(0);
        this.availabilityStatus.set('idle');
      }
    }
  }

  async onSubmit() {
    // Se añade la verificación de disponibilidad
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