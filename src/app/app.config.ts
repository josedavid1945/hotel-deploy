import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Importaciones de Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

// Importación del entorno
import { environment } from '../environments/environment.development';

// IMPORTACIÓN NECESARIA PARA CLOUDINARY
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // PROVEEDOR PARA PETICIONES HTTP (necesario para Cloudinary)
    provideHttpClient(),

    // PROVEEDORES DE FIREBASE (Configuración única y limpia)
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()) // Provider para Storage/Imágenes
  ]
};