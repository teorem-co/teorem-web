import ILevel from './ILevel';
import ISubject from './ISubject';

export default interface ITutorSubjectLevel {
    id: string;
    Subject: ISubject;
    subjectId: string;
    levelId: string;
    Level: ILevel;
    price: number;
}
