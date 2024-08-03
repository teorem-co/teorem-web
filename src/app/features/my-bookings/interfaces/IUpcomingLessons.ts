import ISubject from '../../../../types/ISubject';
import ITutor from '../../../../types/ITutor';
import IUser from '../../../../types/IUser';

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
    Subject: ISubject;
}

export default IUpcomingLessons;
