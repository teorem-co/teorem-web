import IEarningDetails from './IEarningDetails';
import IGraph from './IGraph';

interface IEarnings {
    totalBookings: number;
    totalReviews: number;
    totalStudents: number;
    totalEarnings: number;
    labels: string[];
    earningsGraph: IGraph[];
    studentsGraph: IGraph[];
    bookingsGraph: IGraph[];
    details: IEarningDetails[];
}

export default IEarnings;
