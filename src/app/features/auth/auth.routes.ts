// src/app/features/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { ManageEvents } from '@features/admin/manage-events/manage-events';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login },
  { path: 'registro', component: Register },
  { path: 'eventos', component: ManageEvents } 
];