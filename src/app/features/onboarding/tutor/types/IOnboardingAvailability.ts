import DayEnum from './DayEnum';

export default interface IOnboardingAvailability {
    day: DayEnum;
    beforeNoon: boolean;
    noonToFive: boolean;
    afterFive: boolean;
}
