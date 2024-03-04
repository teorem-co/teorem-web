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
        case 'ponedjeljak':
            return 'monday';
        case 'utorak':
            return 'tuesday';
        case 'srijeda':
            return 'wednesday';
        case 'četvrtak':
            return 'thursday';
        case 'petak':
            return 'friday';
        case 'subota':
            return 'saturday';
        case 'nedjelja':
            return 'sunday';
        default:
            return 'wednesday';
    }
};
