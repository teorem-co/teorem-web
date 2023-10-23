import IEarningDetails from './IEarningDetails';
import IGraph from './IGraph';

interface IEarnings {
    totalBookings: number;
    totalReviews: number;
    totalStudents: number;
    totalEarnings: number;
    labels: string[];
    earnings_graph: IGraph[];
    students_graph: IGraph[];
    bookings_graph: IGraph[];
    details: IEarningDetails[];
}

export default IEarnings;
