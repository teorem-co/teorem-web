import IEarningDetails from './IEarningDetails';
import IGraph from './IGraph';

interface IEarnings {
    totalBookings: number;
    totalReviews: number;
    totalStudents: number;
    totalEarnings: number;
    graph: IGraph[];
    details: IEarningDetails[];
}

export default IEarnings;
