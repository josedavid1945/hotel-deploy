import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent { // Se recomienda usar 'RegisterComponent' como nombre de clase
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Formulario con todos los campos y validaciones
  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.registerForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    try {
      // Pasamos todos los datos del formulario al servicio de registro
      await this.authService.register(this.registerForm.value);
      
      // Cerramos la sesión que Firebase crea automáticamente
      await this.authService.logout();
      
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      this.router.navigate(['/auth/login']); 
      

    } catch (error) {
      console.error('Error en el registro:', error);
      alert('El correo electrónico ya está en uso o hubo otro error.');
    }
  }
}