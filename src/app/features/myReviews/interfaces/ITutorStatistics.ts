import ITutorStatisticsResult from './ITutorStatisticsResult';

interface ITutorStatistics {
    result: ITutorStatisticsResult[];
    statistic: number;
    punctuality: number;
    communication: number;
    knowledge: number;
}

export default ITutorStatistics;
