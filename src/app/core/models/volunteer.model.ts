export interface Volunteer {
    id?: string;
    fullName: string;
    email: string;
    phone: string;
    skills: string[]; // e.g. ['Teaching', 'Coding']
    availability: 'Weekdays' | 'Weekends' | 'Flexible';
    startDate: Date;
    status: 'Active' | 'Inactive' | 'Pending';
    createdAt: any; // Firestore Timestamp
}
