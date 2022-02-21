import ICompletedLesson from '../../my-bookings/interfaces/ICompletedLesson';

interface IGroupedList {
    [studentId: string]: ICompletedLesson[];
}

export default IGroupedList;
