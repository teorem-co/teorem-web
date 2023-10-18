import IEarningDetails from './IEarningDetails';
import IGraph from './IGraph';

interface IEarnings {
    totalBookings: number;
    totalReviews: number;
    totalStudents: number;
    totalEarnings: number;
    monthsForDisplay: String[];
    earnings_graph: IGraph[];
    students_graph: IGraph[];
    bookings_graph: IGraph[];
    details: IEarningDetails[];
}

export default IEarnings;
