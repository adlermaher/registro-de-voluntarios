import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, Timestamp, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Activity } from '../../../core/models/activity.model';

@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    private firestore: Firestore = inject(Firestore);
    private collectionName = 'activities';

    getActivities(): Observable<Activity[]> {
        const colRef = collection(this.firestore, this.collectionName);
        const q = query(colRef, orderBy('date', 'asc'));
        return collectionData(q, { idField: 'id' }) as Observable<Activity[]>;
    }

    addActivity(activity: Activity) {
        const colRef = collection(this.firestore, this.collectionName);
        return addDoc(colRef, activity);
    }

    updateActivity(id: string, data: Partial<Activity>) {
        const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
        return updateDoc(docRef, data);
    }

    deleteActivity(id: string) {
        const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
        return deleteDoc(docRef);
    }
}
