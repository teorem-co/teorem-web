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
    userId: string;
}

export const bookingService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getBookings: builder.query<IBookingTest | null, IBookingWeek>({
            query: (data) => ({
                url: `${URL}/week/${data.userId}?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
                method: HttpMethods.GET
            }),
        }),
    }),
});

export const { useLazyGetBookingsQuery } = bookingService;