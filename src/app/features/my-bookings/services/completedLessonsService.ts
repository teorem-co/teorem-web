import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import ICompletedLesson from '../interfaces/ICompletedLesson';

const URL = '/api/v1/completed-lessons';

export interface IBookingInfo {
    bookingId: string;
    startTime: string;
    meetingId: string;
}

export interface IGetBookingInfo {
    studentId: string;
    tutorId: string;
    subjectId: string;
    page: number;
    rpp: number;
}

export const completedLessonsService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getCompletedLessons: builder.query<ICompletedLesson[], void>({
            query: () => ({
                url: `${URL}`,
                method: HttpMethods.GET,
            }),
        }),

        getCompletedLessonsBookingInfo: builder.query<IBookingInfo[], IGetBookingInfo>({
            query: (params) => ({
                url: `${URL}/booking-info?studentId=${params.studentId}&tutorId=${params.tutorId}&subjectId=${params.subjectId}&page=${params.page}&size=${params.rpp}`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const { useLazyGetCompletedLessonsQuery, useLazyGetCompletedLessonsBookingInfoQuery } = completedLessonsService;
