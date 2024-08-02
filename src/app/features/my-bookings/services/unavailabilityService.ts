import { HttpMethods } from '../../../lookups/httpMethods';
import { baseService } from '../../../store/baseService';
import { IUnavailability } from '../interfaces/IUnavailability';
import moment from 'moment/moment';

//bookings/week/:tutorSlug

const URL = 'api/v1/tutors/unavailability';
const TUTORS_URL = 'api/v1/tutors';

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
                url: `${TUTORS_URL}/${data.tutorId}/unavailability?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}`,
                method: HttpMethods.GET,
            }),
            transformResponse: (response: IUnavailability[]) => {
                const bookings: IUnavailabilityTransformed[] = response.map((x) => {
                    console.log('END TIME FOR UNAVA: ', x.endTime);
                    return {
                        id: x.id,
                        label: 'unavailableCustom',
                        start: new Date(x.startTime),
                        // end: new Date(x.endTime),
                        end: new Date(moment(x.endTime).subtract(1, 'second').toISOString()), // this is because it will add 1 minute to the end time (if end time is 18:00 it will show as 18:01)
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
    useDeleteTutorUnavailabilityMutation,
} = unavailabilityService;
