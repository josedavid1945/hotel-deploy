import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Pipe({
  name: 'firestoreDate',
  standalone: true
})
export class FirestoreDatePipe implements PipeTransform {

  transform(value: any): Date | null {
    if (!value) {
      return null;
    }

    // Si el valor tiene un método .toDate() (es un Timestamp de Firebase)
    if (typeof value.toDate === 'function') {
      return value.toDate();
    }

    // Si ya es una fecha de JavaScript, la devuelve tal cual
    return value;
  }

}