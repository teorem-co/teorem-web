import IBooking from '../../../../interfaces/IBooking';
import { baseService } from '../../../baseService';
import { IUpcomingLessons } from '../../../constants/upcomingLessons';
import { HttpMethods } from '../../../lookups/httpMethods';

//bookings/week/:tutorId

const URL = '/bookings';

interface IBookingItem {
    count: number;
    rows: IBooking[];
}

interface IBookingWeek {
    dateFrom: string;
    dateTo: string;
    userId: string;
}

interface IBookingTransformed {
    id: string;
    label: string;
    start: Date;
    end: Date;
    allDay: boolean;
}

interface INotificationForLessons {
    userId: string;
    date: string;
}

export const bookingService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getBookings: builder.query<IBookingTransformed[], IBookingWeek>({
            query: (data) => ({
                url: `${URL}/week/${data.userId}?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: IBookingItem) => {
                const bookings: IBookingTransformed[] = response.rows.map(
                    (x) => {
                        return {
                            id: x.id,
                            label: x.Subject ? x.Subject.abrv : 'No title',
                            start: new Date(x.startTime),
                            end: new Date(x.endTime),
                            allDay: false,
                        };
                    }
                );
                return bookings;
            },
        }),
        getUpcomingLessons: builder.query<IUpcomingLessons[], string>({
            query: (userId) => ({
                url: `${URL}/${userId}/upcoming`,
                method: HttpMethods.GET,
            }),
        }),
        getNotificationForLessons: builder.query<
            number,
            INotificationForLessons
        >({
            query: (data) => ({
                url: `${URL}/${data.userId}/${data.date}/count`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const {
    useLazyGetBookingsQuery,
    useLazyGetUpcomingLessonsQuery,
    useLazyGetNotificationForLessonsQuery,
} = bookingService;
