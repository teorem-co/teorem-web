import ILevel from './ILevel';
import ISubject from './ISubject';
import ITutor from './ITutor';
import IUser from './IUser';

export default interface IBooking {
    id: string;
    Level: ILevel;
    Subject: ISubject;
    Tutor: ITutor;
    User: IUser;
    tutorId: string;
    studentId: string;
    subjectId: string;
    levelId: string;
    startTime: string;
    endTime: string;
    isAccepted: boolean;
    userFullName: string;
    inReschedule: boolean;
    lastSuggestedUpdateUserId?: string;
    suggestedStartTime?: string;
    suggestedEndTime?: string;
    createdAt?: string;
    cost?: number;
}
