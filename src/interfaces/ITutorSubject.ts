import ILevel from './ILevel';
import ISubject from './ISubject';

export default interface ITutorSubject {
    id: string;
    Subject: ISubject;
    Level: ILevel;
    price: number;
}
