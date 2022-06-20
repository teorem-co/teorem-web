import IBooking from '../app/features/my-bookings/interfaces/IBooking';
import ITutorSubject from './ITutorSubject';
import IUser from './IUser';

export default interface ITutor {
    userId: string;
    currentOccupation: string;
    yearsOfExperience: string;
    aboutTutor: string;
    aboutLessons: string;
    User: IUser;
    TutorSubjects: ITutorSubject[];
    minimumPrice: number;
    maximumPrice: number;
    averageGrade: number;
    completedLessons: number;
    Bookings: IBooking[];
    disabled: boolean;
}
