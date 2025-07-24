import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private http = inject(HttpClient);

  // --- REEMPLAZA ESTOS VALORES CON LOS TUYOS ---
  private cloudName = "dvcyepao5"; 
  private uploadPreset = "a1b2c3d4";

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    return this.http.post(uploadUrl, formData).pipe(
      map((response: any) => {
        // Cloudinary devuelve un objeto con muchos datos, solo nos interesa la URL segura
        return response.secure_url;
      })
    );
  }
}