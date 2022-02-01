import ITutor from '../../../../interfaces/ITutor';
import IUser from '../../../../interfaces/IUser';

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

export default IUpcomingLessons;
