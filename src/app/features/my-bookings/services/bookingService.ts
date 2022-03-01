import { url } from 'inspector';
import { method } from 'lodash';

import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import IBooking from '../interfaces/IBooking';
import ICompletedLesson from '../interfaces/ICompletedLesson';
import IUpcomingLessons from '../interfaces/IUpcomingLessons';

//bookings/week/:tutorId

const URL = '/bookings';

interface IBookingTransformed {
    id: string;
    label: string;
    start: Date;
    end: Date;
    allDay: boolean;
    tutor?: string;
    isAccepted?: boolean;
}

interface IDateRange {
    dateFrom: string;
    dateTo: string;
}

interface INotificationForLessons {
    userId: string;
    date: string;
}

interface IBookingsByIdPayload {
    dateFrom: string;
    dateTo: string;
    tutorId: string;
}

interface ICreateBooking {
    subjectId: string;
    studentId?: string;
    startTime: string;
    tutorId?: string;
}

interface IUpdateBooking {
    startTime: string;
    bookingId: string;
}

export const bookingService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getBookings: builder.query<IBookingTransformed[], IDateRange>({
            query: (data) => ({
                url: `${URL}/?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: IBooking[]) => {
                const bookings: IBookingTransformed[] = response.map((x) => {
                    return {
                        id: x.id,
                        label: x.Subject ? x.Subject.name : 'No title',
                        tutor: x.Tutor ? x.Tutor.User.firstName + ' ' + x.Tutor.User.lastName : 'No tutor name',
                        start: new Date(x.startTime),
                        end: new Date(x.endTime),
                        isAccepted: x.isAccepted,
                        allDay: false,
                    };
                });

                return bookings;
            },
            providesTags: ['bookings'],
        }),
        //maybe change return object to have additional properties to handle unavailable events
        getBookingsById: builder.query<IBookingTransformed[], IBookingsByIdPayload>({
            query: (data) => ({
                url: `${URL}/${data.tutorId}?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: IBooking[]) => {
                const bookings: IBookingTransformed[] = response.map((x) => {
                    return {
                        id: x.id,
                        label: x.Subject ? x.Subject.name : 'No title',
                        start: new Date(x.startTime),
                        end: new Date(x.endTime),
                        allDay: false,
                    };
                });

                return bookings;
            },
        }),
        getUpcomingLessons: builder.query<IUpcomingLessons[], string>({
            query: (userId) => ({
                url: `${URL}/${userId}/upcoming`,
                method: HttpMethods.GET,
            }),
            providesTags: ['upcomingLessons'],
        }),
        getNotificationForLessons: builder.query<number, INotificationForLessons>({
            query: (data) => ({
                url: `${URL}/${data.userId}/${data.date}/count`,
                method: HttpMethods.GET,
            }),
            providesTags: ['lessonCount'],
        }),
        createbooking: builder.mutation<void, ICreateBooking>({
            query: (data) => ({
                url: `${URL}/${data.tutorId}`,
                method: HttpMethods.POST,
                body: data,
            }),
            invalidatesTags: ['tutorBookings'],
        }),
        updateBooking: builder.mutation<void, IUpdateBooking>({
            query: (data) => ({
                url: `${URL}/${data.bookingId}`,
                method: HttpMethods.PUT,
                body: data,
            }),
            invalidatesTags: ['tutorBookings'],
        }),
        getBookingById: builder.query<IBooking, string>({
            query: (bookingId) => ({
                url: `${URL}/${bookingId}`,
            }),
        }),
        getCompletedLessons: builder.query<ICompletedLesson[], void>({
            query: () => ({
                url: `${URL}/completed-lessons`,
                method: HttpMethods.GET,
            }),
        }),
        acceptBooking: builder.mutation<void, string>({
            query: (bookingId) => ({
                url: `${URL}/accept/${bookingId}`,
                method: HttpMethods.PUT,
            }),
            invalidatesTags: ['bookings'],
        }),
        deleteBooking: builder.mutation<void, string>({
            query: (bookingId) => ({
                url: `${URL}/${bookingId}`,
                method: HttpMethods.DELETE,
            }),
            invalidatesTags: ['bookings', 'tutorBookings', 'upcomingLessons', 'lessonCount'],
        }),
    }),
});

export const {
    useLazyGetBookingsQuery,
    useLazyGetUpcomingLessonsQuery,
    useLazyGetNotificationForLessonsQuery,
    useLazyGetBookingsByIdQuery,
    useCreatebookingMutation,
    useLazyGetBookingByIdQuery,
    useUpdateBookingMutation,
    useLazyGetCompletedLessonsQuery,
    useAcceptBookingMutation,
    useDeleteBookingMutation,
} = bookingService;
