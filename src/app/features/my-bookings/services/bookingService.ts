import { t } from 'i18next';

import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import IBooking from '../interfaces/IBooking';
import IUpcomingLessons from '../interfaces/IUpcomingLessons';

//bookings/week/:tutorSlug


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

export interface ICreateBookingDTO {
    requesterId?: string;
    subjectId: string;
    studentId?: string;
    startTime: string;
    tutorId?: string;
    levelId: string;
}

interface IUpdateBooking {
    startTime: string;
    bookingId: string;
}

export interface IGetTutorAvailablePeriodsParams {
  tutorId: string;
  date: string;
  timeZone: string;

}

export interface IGetStudentAvailablePeriodsParams {
  studentId: string;
  date: string;
}

const URL = '/api/v1/bookings';

export const bookingService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getBookings: builder.query<IBookingTransformed[], IDateRange>({
            query: (data) => ({
                url: `${URL}?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,//`${URL}/?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: IBooking[]) => {
                const bookings: IBookingTransformed[] = response.map((x) => {

                    return {
                        id: x.id,
                        label: x.Subject ? t(`SUBJECTS.${x.Subject.abrv.replaceAll('-', '').replaceAll(' ', '')}`) : 'No title',
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
                        label: x.Subject ? t(`SUBJECTS.${x.Subject.abrv.replaceAll('-', '').replaceAll(' ', '')}`) : 'No title',
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
                url: `${URL}/upcoming?userId=${userId}`,
                method: HttpMethods.GET,
            }),
            providesTags: ['upcomingLessons'],
        }),
        getNotificationForLessons: builder.query<number, INotificationForLessons>({
            query: (data) => ({
                url: `${URL}/${data.userId}/count?endTime=${data.date}`,
                method: HttpMethods.GET,
            }),
            providesTags: ['lessonCount'],
        }),
        createbooking: builder.mutation<void, ICreateBookingDTO>({
            query: (data) => ({
                url: `${URL}`, // `${URL}/${data.tutorId}`
                method: HttpMethods.POST,
                body: data,
            }),
            invalidatesTags: ['tutorBookings'],
        }),
        createBooking: builder.mutation<void, any>({
            query: (data) => ({
              url: `${URL}/confirm`,//`${URL}/create/${data.tutorId}`,
              method: HttpMethods.POST,
              body: data,
            }),
            invalidatesTags: ['tutorBookings'],
        }),
        updateBooking: builder.mutation<void, IUpdateBooking>({
            query: (data) => ({
                url: `${URL}/${data.bookingId}?startTime=${data.startTime}`,
                method: HttpMethods.PUT,
                body: data,
            }),
            invalidatesTags: ['tutorBookings'],
        }),
        getBookingById: builder.query<IBooking, string>({
            query: (bookingId) => ({
                url: `${URL}/${bookingId}`,//`${URL}/${bookingId}`,
            }),
        }),
        acceptBooking: builder.mutation<void, string>({
            query: (bookingId) => ({
              url: `${URL}/${bookingId}/accept`,
                method: HttpMethods.PUT,
            }),
            invalidatesTags: ['bookings'],
        }),
        deleteBooking: builder.mutation<void, string>({
            query: (bookingId) => ({
              url: `${URL}/${bookingId}/cancel`,
              method: HttpMethods.PUT,
            }),
            invalidatesTags: ['bookings', 'tutorBookings', 'upcomingLessons', 'lessonCount'],
        }),
        getTutorAvailablePeriods: builder.query<string[], IGetTutorAvailablePeriodsParams>({
          query: (params) => ({
            url: `${URL}/tutor-available-periods?date=${params.date}&tutorId=${params.tutorId}&timeZone=${params.timeZone}`,
            method: HttpMethods.GET,
          }),
        }),
        getStudentAvailablePeriods: builder.query<string[], IGetStudentAvailablePeriodsParams>({
          query: (params) => ({
            url: `${URL}/student-available-periods?date=${params.date}&studentId=${params.studentId}`,
            method: HttpMethods.GET,
          }),
      }),
      getBookingsInReschedule: builder.query<IBooking[], void>({
        query: () => ({
          url: `${URL}/inReschedule`,
          method: HttpMethods.GET,
        }),
      }),
      acceptRescheduleRequest: builder.mutation<void, string>({
        query: (bookingId) => ({
          url: `${URL}/${bookingId}/reschedule/accept`,
          method: HttpMethods.PUT,
        }),
      }),
      denyRescheduleRequest: builder.mutation<void, string>({
        query: (bookingId) => ({
          url: `${URL}/${bookingId}/reschedule/deny`,
          method: HttpMethods.PUT,
        }),
      }),
    }),
});

export const {
    useLazyGetBookingsQuery,
    useLazyGetUpcomingLessonsQuery,
    useLazyGetNotificationForLessonsQuery,
    useLazyGetBookingsByIdQuery,
    useCreatebookingMutation,
    useCreateBookingMutation,
    useLazyGetBookingByIdQuery,
    useUpdateBookingMutation,
    useAcceptBookingMutation,
    useDeleteBookingMutation,
    useLazyGetTutorAvailablePeriodsQuery,
    useLazyGetStudentAvailablePeriodsQuery,
    useLazyGetBookingsInRescheduleQuery,
    useAcceptRescheduleRequestMutation,
    useDenyRescheduleRequestMutation,
} = bookingService;
