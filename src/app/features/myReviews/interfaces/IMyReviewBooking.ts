import IMyReviewBookingLevel from './IMyReviewBookingLevel';
import IMyReviewBookingSubject from './IMyReviewBookingSubject';
import IMyReviewBookingUser from './IMyReviewBookingUser';

interface IMyReviewBooking {
    id: string;
    tutorId: string;
    studentId: string;
    levelId: string;
    startTime: string;
    endTIme: string;
    Level: IMyReviewBookingLevel;
    Subject: IMyReviewBookingSubject;
    User: IMyReviewBookingUser;
}

export default IMyReviewBooking;
