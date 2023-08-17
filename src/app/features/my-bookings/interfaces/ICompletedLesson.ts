import ILevel from '../../../../interfaces/ILevel';
import ISubject from '../../../../interfaces/ISubject';
import ITutor from '../../../../interfaces/ITutor';
import IUser from '../../../../interfaces/IUser';

interface ICompletedLesson {
    tutorId: string;
    subjectId: string;
    studentId: string;
    count: number;
    Tutor: ITutor;
    User: IUser;
    Subject: ISubject;
    id: string;
    level: ILevel;
    isReview: boolean;
    index?: number;
}

export default ICompletedLesson;
