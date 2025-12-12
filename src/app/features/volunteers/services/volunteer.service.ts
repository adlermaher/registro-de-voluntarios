import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, Timestamp, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Volunteer } from '../../../core/models/volunteer.model';

@Injectable({
    providedIn: 'root'
})
export class VolunteerService {
    private firestore: Firestore = inject(Firestore);
    private collectionName = 'volunteers';

    getVolunteers(): Observable<Volunteer[]> {
        const colRef = collection(this.firestore, this.collectionName);
        const q = query(colRef, orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<Volunteer[]>;
    }

    addVolunteer(volunteer: Volunteer) {
        const colRef = collection(this.firestore, this.collectionName);
        return addDoc(colRef, {
            ...volunteer,
            createdAt: Timestamp.now()
        });
    }

    updateVolunteer(id: string, data: Partial<Volunteer>) {
        const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
        return updateDoc(docRef, data);
    }

    deleteVolunteer(id: string) {
        const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
        return deleteDoc(docRef);
    }
}
