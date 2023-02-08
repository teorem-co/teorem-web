import IBooking from './../app/features/my-bookings/interfaces/IBooking';

interface IDashboard {
    todaySchedule: IBooking[];
    upcoming: IBooking[];
}

export default IDashboard;
