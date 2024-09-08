enum DayEnum {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
    SUNDAY = 7,
}

// used for sending days to backend for compatibility reasons
// once all places where availability is changed are updated, this can be removed and the function updateTutorAvailabilityAndTimezone in TutorController can be updated to use DayEnum directly and update OnboardingAvailabilityDTO class to use DayOfWeek enum
export const DAY_STRINGS_MAP = {
    [DayEnum.MONDAY]: 'mon',
    [DayEnum.TUESDAY]: 'tue',
    [DayEnum.WEDNESDAY]: 'wed',
    [DayEnum.THURSDAY]: 'thu',
    [DayEnum.FRIDAY]: 'fri',
    [DayEnum.SATURDAY]: 'sat',
    [DayEnum.SUNDAY]: 'sun',
};

export default DayEnum;
