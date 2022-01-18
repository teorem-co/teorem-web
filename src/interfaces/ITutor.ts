import ILevel from './ILevel';
import ISubject from './ISubject';
import IUser from './IUser';

export default interface ITutor {
    userId: string;
    currentOccupation: string;
    yearsOfExperience: string;
    aboutTutor: string;
    aboutLessons: string;
    User: IUser;
    Levels: ILevel[];
    Subjects: ISubject[];
}
