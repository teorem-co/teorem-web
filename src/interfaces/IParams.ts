interface IParams {
    subject?: string;
    level?: string;
    dayOfWeek?: string;
    timeOfDay?: string;
    sort?: string;
    page: number;
    rpp: number;
    verified?: number;
    unprocessed?: number;
    search?: string;
    videoApproved?: boolean;
}

export default IParams;
