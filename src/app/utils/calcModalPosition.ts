export const calcModalPosition = (dayOfWeek: string) => {
    switch (dayOfWeek) {
        case 'Monday':
            return 'monday';
        case 'Tuesday':
            return 'tuesday';
        case 'Wednesday':
            return 'wednesday';
        case 'Thursday':
            return 'thursday';
        case 'Friday':
            return 'friday';
        case 'Saturday':
            return 'saturday';
        case 'Sunday':
            return 'sunday';
        default:
            return 'wednesday';
    }
};
