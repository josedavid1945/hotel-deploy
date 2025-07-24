import { Routes } from '@angular/router';
// CORRECCIÓN: Los nombres de los archivos generados suelen ser con punto (ej: admin.guard.ts)
import { adminGuard } from '@core/guards/admin-guard'; 
import { authGuard } from '@core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/public/public.routes').then(m => m.PUBLIC_ROUTES)
  },
  {
    path: 'auth',
    // CORRECCIÓN: El nombre del archivo es 'auth.routes' (plural)
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'cliente',
    canActivate: [authGuard],
    // CORRECCIÓN: Añadido para solucionar el error de prerendering con SSR
    loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];