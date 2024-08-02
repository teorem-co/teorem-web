import { baseService } from '../baseService';
import { HttpMethods } from '../../lookups/httpMethods';
import IBooking from '../../features/my-bookings/interfaces/IBooking';

const URL = '/api/v1/dashboard';

export interface ITimeZone {
    timeZoneId: string;
    offset: string;
}

export const dashboardService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getRequests: builder.query<IBooking[], void>({
            query: () => ({
                url: `${URL}/upcoming?accepted=false`,
                method: HttpMethods.GET,
            }),
        }),
        getUpcoming: builder.query<IBooking[], void>({
            query: () => ({
                url: `${URL}/upcoming?accepted=true`,
                method: HttpMethods.GET,
            }),
        }),
        getTodaySchedule: builder.query<IBooking[], void>({
            query: () => ({
                url: `${URL}/today-schedule`,
                method: HttpMethods.GET,
            }),
        }),
        getAllTimeZones: builder.query<ITimeZone[], void>({
            query: () => ({
                url: `${URL}/allTimeZones`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const {
    useLazyGetUpcomingQuery,
    useLazyGetRequestsQuery,
    useLazyGetTodayScheduleQuery,
    useLazyGetAllTimeZonesQuery,
} = dashboardService;
