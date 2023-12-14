import IWeek from "./IWeek";

interface IEarningDetails {
    period: string;
    revenue: number;
    reviews: number;
    students: number;
    bookings: number;
    weeks?: IWeek[];
}

export default IEarningDetails;
