import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// CORRECCIÓN: La ruta de importación debe ser completa
import { DataService, HotelEvent } from '@core/services/data';
import { Observable } from 'rxjs';
import { CloudinaryService } from '@core/services/cloudinary';

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-events.html',
  styleUrl: './manage-events.css'
})
export class ManageEvents {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private cloudinaryService = inject(CloudinaryService);

  events$: Observable<HotelEvent[]> = this.dataService.getEvents();
  eventForm: FormGroup;
  editingEventId: string | null = null;
  selectedFile: File | null = null;

  constructor() {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      price: [0],
      capacity: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmit() {
    if (this.eventForm.invalid) return;
    try {
      let imageUrl = this.eventForm.value.imageUrl || '';

      if (this.selectedFile) {
        imageUrl = await new Promise<string>((resolve, reject) => {
          this.cloudinaryService.uploadImage(this.selectedFile!).subscribe({
            next: (url) => resolve(url),
            error: (err) => reject(err)
          });
        });
      }
      
      // CORRECCIÓN: Usamos una variable 'eventData' para guardar los datos combinados
      const eventData = { ...this.eventForm.value, imageUrl };

      if (this.editingEventId) {
        // CORRECCIÓN: Pasamos 'eventData' en lugar de 'this.eventForm.value'
        await this.dataService.updateEvent(this.editingEventId, eventData);
      } else {
        // CORRECCIÓN: Pasamos 'eventData' en lugar de 'this.eventForm.value'
        await this.dataService.addEvent(eventData as HotelEvent);
      }
      this.resetForm();
    } catch (error) {
      console.error("Error al guardar el evento:", error);
    }
  }

  selectEventToEdit(event: HotelEvent) {
    this.editingEventId = event.id!;
    // Usamos patchValue para más seguridad con campos opcionales
    this.eventForm.patchValue({
      name: event.name,
      date: event.date,
      description: event.description,
      price: event.price || 0,
      capacity: event.capacity || 0,
      imageUrl: event.imageUrl || ''
    });
  }

  cancelEdit() { this.resetForm(); }
  
  private resetForm() {
    this.eventForm.reset();
    this.editingEventId = null;
    // CORRECCIÓN: Limpiamos también el archivo seleccionado
    this.selectedFile = null;
  }

  async deleteEvent(eventId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      await this.dataService.deleteEvent(eventId);
    }
  }
}