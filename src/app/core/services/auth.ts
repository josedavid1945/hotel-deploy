import { Injectable, computed, inject, signal } from '@angular/core';
import { User, onAuthStateChanged } from 'firebase/auth';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
// IMPORTAMOS FIRESTORE para guardar datos adicionales del usuario
import { Firestore, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collection } from 'firebase/firestore';

// --- DEFINE AQUÍ TU CORREO DE ADMIN ---
const ADMIN_EMAIL = "giorno2005@outlook.es";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore); // Inyectamos Firestore
  
  private currentUserSig = signal<User | null | undefined>(undefined);
  
  currentUser = computed(() => this.currentUserSig());
  isLoggedIn = computed(() => this.currentUser() != null);
  isAdmin = computed(() => this.currentUser()?.email === ADMIN_EMAIL);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSig.set(user);
    });
  }

  // --- MÉTODO REGISTER CORREGIDO ---
  async register(value: any) {
    // 1. Creamos el usuario en el servicio de Autenticación de Firebase
    const userCredential = await createUserWithEmailAndPassword(this.auth, value.email, value.password);
    
    // 2. Creamos una referencia a un nuevo documento en la colección 'users'
    //    Usamos el ID del nuevo usuario (uid) como ID del documento
    const userDocRef = doc(this.firestore, `users/${userCredential.user.uid}`);
    
    // 3. Guardamos los datos adicionales (nombre, apellido, etc.) en ese documento
    await setDoc(userDocRef, {
      firstName: value.firstName,
      lastName: value.lastName,
      phone: value.phone,
      email: value.email,
      role: 'client' // Asignamos el rol de 'cliente' por defecto
    });

    return userCredential;
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
  
}