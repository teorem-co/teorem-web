import ILevel from '../../../../interfaces/ILevel';
import ISubject from '../../../../interfaces/ISubject';
import ITutor from '../../../../interfaces/ITutor';
import IUser from '../../../../interfaces/IUser';

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
}
