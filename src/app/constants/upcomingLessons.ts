import IUser from '../../interfaces/IUser';
import { bookingService } from '../features/my-bookings/services/bookingService';

interface ITutor {
    User: IUser;
    userId: string;
}

export interface IUpcomingLessons {
    id: string;
    tutorId: string;
    studentId: string;
    subjectId: string;
    levelId: string;
    startTime: string;
    endTime: string;
    User: IUser;
    Tutor: ITutor;
}
