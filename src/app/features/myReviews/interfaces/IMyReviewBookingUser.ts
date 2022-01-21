import IMyReviewBookingUserRole from "./IMyReviewBookingUserRole";

interface IMyReviewBookingUser {
    firstName: string;
    lastName: string;
    Role: IMyReviewBookingUserRole;
}

export default IMyReviewBookingUser;