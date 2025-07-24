import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// CORRECCIÓN: La ruta de importación debe ser completa
import { DataService, Hall } from '@core/services/data';
import { Observable } from 'rxjs';
import { CloudinaryService } from '@core/services/cloudinary';

@Component({
  selector: 'app-manage-halls',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-halls.html',
  styleUrl: './manage-halls.css'
})
export class ManageHalls {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  // CORRECCIÓN: Typo en 'cloudinaryService'
  private cloudinaryService = inject(CloudinaryService);

  halls$: Observable<Hall[]> = this.dataService.getHalls();
  hallForm: FormGroup;
  editingHallId: string | null = null;
  selectedFile: File | null = null;

  constructor() {
    this.hallForm = this.fb.group({
      name: ['', Validators.required],
      capacity: [10, [Validators.required, Validators.min(1)]],
      price: [100, [Validators.required, Validators.min(0)]],
      equipment: ['', Validators.required],
      // CORRECCIÓN: Añadido el campo para la URL de la imagen
      imageUrl: [''] 
    });
  }

  // Captura el archivo del input
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmit() {
    if (this.hallForm.invalid) return;

    try {
      let imageUrl = this.hallForm.value.imageUrl || '';

      if (this.selectedFile) {
        imageUrl = await new Promise<string>((resolve, reject) => {
          this.cloudinaryService.uploadImage(this.selectedFile!).subscribe({
            next: (url) => resolve(url),
            error: (err) => reject(err)
          });
        });
      }

      const hallData = { ...this.hallForm.value, imageUrl };

      if (this.editingHallId) {
        await this.dataService.updateHall(this.editingHallId, hallData);
      } else {
        await this.dataService.addHall(hallData);
      }

      this.resetForm();
      this.selectedFile=null;

    } catch (error) {
      console.error("Error al guardar el salón:", error);
      alert("Error al guardar el salón. Revisa la consola.");
    }
    
  }

  selectHallToEdit(hall: Hall) {
    this.editingHallId = hall.id!;
    // CORRECCIÓN: Usamos patchValue para manejar el campo opcional 'imageUrl'
    this.hallForm.patchValue({
      name: hall.name,
      capacity: hall.capacity,
      price: hall.price,
      equipment: hall.equipment,
      imageUrl: hall.imageUrl || ''
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.hallForm.reset();
    this.editingHallId = null;
    // CORRECCIÓN: Limpiamos el archivo seleccionado
    this.selectedFile = null; 
  }

  async deleteHall(hallId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este salón?')) {
      await this.dataService.deleteHall(hallId);
    }
  }
}