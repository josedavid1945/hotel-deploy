import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// ESTA IMPORTACIÓN ES CRUCIAL
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  // ASEGÚRATE DE QUE ReactiveFormsModule ESTÉ AQUÍ
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // ESTA DEFINICIÓN ES NECESARIA PARA [formGroup]="registerForm"
  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
  // ESTA LÍNEA ES NUESTRA PRUEBA
  console.log('Botón presionado. Estado del formulario:', this.registerForm);

  if (this.registerForm.invalid) {
    console.log('El formulario es inválido, no se enviará.');
    return;
  }

  try {
    console.log('El formulario es válido, intentando registrar...');
    const { email, password } = this.registerForm.value;
    await this.authService.register({ email, password });
    this.router.navigate(['/auth/login']); 
  } catch (error) {
    console.error('Error en el registro:', error);
  }
}
}