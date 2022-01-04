import IBooking from "../../../../interfaces/IBooking";
import { baseService } from "../../../baseService";
import { HttpMethods } from "../../../lookups/httpMethods";

//bookings/week/:tutorId

const URL = "/bookings";

interface IBookingTest {
    count: number;
    rows: IBooking[];
}

interface IBookingWeek {
    dateFrom: string;
    dateTo: string;
}

export const bookingService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getBookings: builder.query<IBookingTest | null, IBookingWeek>({
            query: (data) => ({
                url: `${URL}/week/236910e8-758b-40bb-972e-2a63d0ec76ca?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
                method: HttpMethods.GET
            }),
        }),
    }),
});

export const { useLazyGetBookingsQuery } = bookingService;