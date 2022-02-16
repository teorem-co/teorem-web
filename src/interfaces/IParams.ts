interface IParams {
    subject?: string;
    level?: string;
    dayOfWeek?: string;
    timeOfDay?: string;
    sort?: string;
    page: number;
    rpp: number;
}

export default IParams;
