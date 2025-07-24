import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService, Room } from '@core/services/data';
import { Observable } from 'rxjs';
import { CloudinaryService } from '@core/services/cloudinary'; // IMPORTA CloudinaryService

@Component({
  selector: 'app-manage-rooms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-rooms.html',
  styleUrl: './manage-rooms.css'
})
export class ManageRooms {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private cloudinaryService = inject(CloudinaryService); // INYECTA CloudinaryService

  rooms$: Observable<Room[]> = this.dataService.getRooms();
  roomForm: FormGroup;
  editingRoomId: string | null = null;
  selectedFile: File | null = null; // Para guardar el archivo seleccionado

  constructor() {
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      guestCapacity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      imageUrl: [''] // Campo para guardar la URL de la imagen
    });
  }

  // NUEVO: Método para capturar el archivo del input
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // MÉTODO onSubmit MODIFICADO para subir la imagen
  async onSubmit() {
    if (this.roomForm.invalid) return;

    try {
      // Obtenemos la URL de la imagen existente (si estamos editando)
      let imageUrl = this.roomForm.value.imageUrl || '';

      // Si el administrador seleccionó un archivo nuevo, lo subimos
      if (this.selectedFile) {
        // Usamos una Promise para esperar la respuesta de Cloudinary
        imageUrl = await new Promise<string>((resolve, reject) => {
          this.cloudinaryService.uploadImage(this.selectedFile!).subscribe({
            next: (url) => resolve(url),
            error: (err) => reject(err)
          });
        });
      }

      // Combinamos los datos del formulario con la URL de la imagen
      const roomData = { ...this.roomForm.value, imageUrl };

      if (this.editingRoomId) {
        await this.dataService.updateRoom(this.editingRoomId, roomData);
      } else {
        await this.dataService.addRoom(roomData);
      }
      
      this.resetForm();
    } catch (error) {
      console.error("Error al guardar la habitación:", error);
      alert("Error al guardar la habitación. Revisa la consola.");
    }
  }

  // Carga los datos de una habitación en el formulario para editarla
  selectRoomToEdit(room: Room) {
    this.editingRoomId = room.id!;
    this.roomForm.patchValue({ // Usamos patchValue por si imageUrl no existe
      name: room.name,
      guestCapacity: room.guestcapacity,
      price: room.price,
      description: room.description,
      quantity: room.quantity,
      imageUrl: room.imageUrl || ''
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.roomForm.reset();
    this.editingRoomId = null;
    this.selectedFile = null; // Limpiamos el archivo seleccionado
    // Reseteamos el valor del input de archivo si lo tuviéramos referenciado
  }
  
  async deleteRoom(roomId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
      try {
        await this.dataService.deleteRoom(roomId);
      } catch (error) {
        console.error("Error al eliminar la habitación:", error);
      }
    }
  }
}