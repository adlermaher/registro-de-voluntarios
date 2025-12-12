export interface Activity {
    id?: string;
    title: string;
    description: string;
    date: any; // Timestamp or Date
    location: string;
    organizer: string;
    maxVolunteers: number;
    status: 'Open' | 'Closed' | 'Completed';
}
