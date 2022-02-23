import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import { IUnavailability } from '../interfaces/IUnavailability';

//bookings/week/:tutorId

const URL = '/tutor-unvailabilities';

interface IUnavailabilityTransformed {
    id: string;
    label: string;
    start: Date;
    end: Date;
    allDay: boolean;
}

interface IDateRange {
    dateFrom: string;
    dateTo: string;
}

export const unavailabilityService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getUnavailableBookings: builder.query<IUnavailabilityTransformed[], IDateRange>({
            query: (data) => ({
                url: `${URL}/?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: IUnavailability[]) => {
                const bookings: IUnavailabilityTransformed[] = response.map((x) => {
                    return {
                        id: x.id,
                        label: 'Unavailable',
                        start: new Date(x.startTime),
                        end: new Date(x.endTime),
                        allDay: false,
                    };
                });

                return bookings;
            },
        }),
    }),
});

export const { useLazyGetUnavailableBookingsQuery } = unavailabilityService;
