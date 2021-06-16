export interface User {
    name: string;
    dob: Date;
    govtId: string;
    gender?: string;
    bookingInfo: {
        booking_date: string;
        vaccine: string;
        id: number;
        dose_id: number;
    }
}
