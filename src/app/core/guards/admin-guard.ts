import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos la nueva señal 'isAdmin' del servicio
  if (authService.isAdmin()) {
    return true; // Si es admin, permite el acceso
  }

  // Si no, lo redirige al inicio
  router.navigate(['/']);
  return false;
};