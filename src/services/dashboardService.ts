import {baseService} from '../app/baseService';
import {HttpMethods} from "../app/lookups/httpMethods";
import IBooking from "../app/features/my-bookings/interfaces/IBooking";

const URL = '/api/v1/dashboard';

export const dashboardService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getUpcoming: builder.query<IBooking[], void>({
      query: () => ({
        url: `${URL}/upcoming`,
        method: HttpMethods.GET,
      }),
    }),
    getTodaySchedule: builder.query<IBooking[], void>({
      query: () => ({
        url: `${URL}/today-schedule`,
        method: HttpMethods.GET,
      }),
    }),
  }),
});

export const {
  useLazyGetUpcomingQuery,
  useLazyGetTodayScheduleQuery,
} = dashboardService;
