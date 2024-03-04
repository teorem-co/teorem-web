import { baseService } from '../app/baseService';
import { HttpMethods } from '../app/lookups/httpMethods';
import IBooking from '../app/features/my-bookings/interfaces/IBooking';

const URL = '/api/v1/dashboard';

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
        getAllTimeZones: builder.query<string[], void>({
            query: () => ({
                url: `${URL}/allTimeZones`,
                method: HttpMethods.GET,
            }),
        }),
    }),
});

export const { useLazyGetUpcomingQuery, useLazyGetRequestsQuery, useLazyGetTodayScheduleQuery, useLazyGetAllTimeZonesQuery } = dashboardService;
