import ILevel from './ILevel';
import ISubject from './ISubject';

export default interface ITutorSubject {
    id: string;
    Subject: ISubject;
    subjectId: string;
    levelId: string;
    Level: ILevel;
    price: number;
}
