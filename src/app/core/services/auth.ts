import { Injectable, computed, inject, signal } from '@angular/core';
import { User, onAuthStateChanged } from 'firebase/auth';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

// --- DEFINE AQUÍ TU CORREO DE ADMIN ---
const ADMIN_EMAIL = "giorno2005@outlook.es";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  private currentUserSig = signal<User | null | undefined>(undefined);
  
  currentUser = computed(() => this.currentUserSig());
  isLoggedIn = computed(() => this.currentUser() != null);

  // --- NUEVA SEÑAL PARA SABER SI ES ADMIN ---
  isAdmin = computed(() => this.currentUser()?.email === ADMIN_EMAIL);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSig.set(user);
    });
  }

  // ... (los métodos login, register y logout se quedan igual) ...

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}