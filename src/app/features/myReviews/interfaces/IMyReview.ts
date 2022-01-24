import IMyReviewBooking from "./IMyReviewBooking";

interface IMyReview {
    id: string;
    bookingId: string;
    tutorId: string;
    createdAt: string;
    title: string;
    comment: string;
    mark: number;
    Booking: IMyReviewBooking;
}

export default IMyReview;