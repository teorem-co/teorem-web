import ILevel from '../../../../interfaces/ILevel';
import ISubject from '../../../../interfaces/ISubject';
import ITutor from '../../../../interfaces/ITutor';
import IUser from '../../../../interfaces/IUser';

interface IMyReview {
    id: string;
    bookingId: string;
    createdAt: string;
    title: string;
    comment: string;
    mark: number;
    tutorId: string;
    Tutor: ITutor;
    levelId: string;
    Level: ILevel;
    subjectId: string;
    Subject: ISubject;
    userId: string;
    User: IUser;
}

export default IMyReview;
