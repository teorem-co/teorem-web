import ILevel from '../../../../types/ILevel';
import ISubject from '../../../../types/ISubject';
import ITutor from '../../../../types/ITutor';
import IUser from '../../../../types/IUser';

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
