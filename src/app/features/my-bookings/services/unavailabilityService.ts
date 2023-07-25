import { baseService } from '../../../baseService';
import { HttpMethods } from '../../../lookups/httpMethods';
import { IUnavailability } from '../interfaces/IUnavailability';

//bookings/week/:tutorSlug

const URL = 'api/v1/tutor-unavailability';

interface IUnavailabilityTransformed {
    id: string;
    label: string;
    start: Date;
    end: Date;
    allDay: boolean;
}

interface IGetUnavailabilities {
    tutorId: string;
    dateFrom: string;
    dateTo: string;
}

export interface IPostUnavailability {
    startTime: Date;
    endTime: Date;
}

export const unavailabilityService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        getUnavailableBookings: builder.query<IUnavailabilityTransformed[], IGetUnavailabilities>({
            query: (data) => ({
                url: `${URL}/${data.tutorId}?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
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
            providesTags: ['tutor-unavailability'],
        }),
        createTutorUnavailability: builder.mutation<void, IPostUnavailability>({
            query(body) {
                return {
                    url: `${URL}`,
                    method: HttpMethods.POST,
                    body,
                };
            },
            invalidatesTags: ['tutor-unavailability'],
        }),
        deleteTutorUnavailability: builder.mutation<void, string>({
            query(body) {
                return {
                    url: `${URL}/${body}`,
                    method: HttpMethods.DELETE,
                };
            },
            invalidatesTags: ['tutor-unavailability'],
        }),
    }),
});

export const {
    useLazyGetUnavailableBookingsQuery,
    useCreateTutorUnavailabilityMutation,
    useDeleteTutorUnavailabilityMutation
} = unavailabilityService;
