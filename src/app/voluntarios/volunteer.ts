import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, collectionData, docData, query, where, orderBy } from '@angular/fire/firestore';
import { from, Observable, map } from 'rxjs';
import { Volunteer } from './volunteer.model';
import { collectionSnapshots } from '@angular/fire/firestore'; // opcional

@Injectable({ providedIn: 'root' })
export class VolunteerService {
  private colName = 'voluntarios';

  constructor(private firestore: Firestore) {}

  create(vol: Volunteer) {
    const colRef = collection(this.firestore, this.colName);
    return from(addDoc(colRef, vol));
  }

  update(id: string, data: Partial<Volunteer>) {
    const docRef = doc(this.firestore, `${this.colName}/${id}`);
    return from(updateDoc(docRef, data as any));
  }

  delete(id: string) {
    const docRef = doc(this.firestore, `${this.colName}/${id}`);
    return from(deleteDoc(docRef));
  }

  // Obtener lista en tiempo real del usuario
  getByUser(userId: string): Observable<Volunteer[]> {
    const q = query(collection(this.firestore, this.colName), where('userId', '==', userId), orderBy('fechaRegistro', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Volunteer[]>;
  }

  // Búsqueda/filtrado simple por nombre (cliente)
  searchByName(userId: string, name: string) {
    // Firestore no soporta contains case-insensitive. Se puede guardar un campo 'nombre_lower' para búsquedas.
    // Alternativa: filtrar en cliente tras traer la colección del usuario.
    return this.getByUser(userId).pipe(
      map(list => list.filter(v => `${v.nombre} ${v.apellido ?? ''}`.toLowerCase().includes(name.toLowerCase())))
    );
  }
}