import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth'; // Usando el alias

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Definición del formulario de login
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  // Método que se ejecuta al enviar el formulario
  async onSubmit() {
  if (this.loginForm.invalid) {
    return;
  }

  try {
    const { email, password } = this.loginForm.value;
    await this.authService.login({ email, password });

    // Redirigimos SIEMPRE a la página de inicio
    this.router.navigate(['/']);

  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
  }
}
}