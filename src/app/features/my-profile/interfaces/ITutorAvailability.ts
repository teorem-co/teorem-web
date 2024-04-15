export interface ITutorAvailability {
    id?: string;
    tutorId?: string;
    beforeNoon: boolean;
    noonToFive: boolean;
    afterFive: boolean;
    dayOfWeek: string;
    timeZone: string;
}

export default ITutorAvailability;
