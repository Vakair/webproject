import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'firestoreDate'
})
export class FirestoreDatePipe implements PipeTransform {
  transform(value: any): string | null {
    if (!value) return null;

    if (value instanceof Timestamp) {
      const date = value.toDate();
      return date.toLocaleDateString('hu-HU');  // pl. magyar formátum
    } else if (value instanceof Date) {
      return value.toLocaleDateString('hu-HU');
    } else if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('hu-HU');
      }
    }
    return null;
  }
}
