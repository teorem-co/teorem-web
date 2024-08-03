import ILevel from '../../../types/ILevel';
import ISubject from '../../../types/ISubject';
import ITutor from '../../../types/ITutor';
import IUser from '../../../types/IUser';

interface IMyReview {
    id: string;
    bookingId: string;
    createdAt: string;
    title: string;
    comment: string;
    mark: number;
    punctualityMark: number;
    communicationMark: number;
    knowledgeMark: number;
    tutorId: string;
    Tutor: ITutor;
    levelId: string;
    Level: ILevel;
    subjectId: string;
    Subject: ISubject;
    userId: string;
    User: IUser;
    userName: string;
    role: string;
    numberOfCompletedLessons: number;
}

export default IMyReview;
